const express = require("express");
const cors    = require("cors");
const fetch   = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const CONGRESS_KEY  = process.env.CONGRESS_API_KEY || "";
const CONGRESS_BASE = "https://api.congress.gov/v3";
const CURRENT_CONG  = 119;

// ── Helpers ───────────────────────────────────────────────────────────────────
function congressUrl(path, params = {}) {
  const url = new URL(`${CONGRESS_BASE}${path}`);
  url.searchParams.set("api_key", CONGRESS_KEY);
  url.searchParams.set("format",  "json");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

async function congressFetch(path, params = {}) {
  const res = await fetch(congressUrl(path, params));
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Congress.gov ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// Fetch ALL pages from a paginated Congress.gov endpoint
async function fetchAllPages(path, params = {}, maxPages = 10) {
  let all   = [];
  let offset = 0;
  const limit = 250;

  for (let page = 0; page < maxPages; page++) {
    const data = await congressFetch(path, { ...params, limit, offset });
    const items = data.members || data.bills || [];
    all = [...all, ...items];
    const total = data.pagination?.count ?? items.length;
    offset += limit;
    if (offset >= total || items.length < limit) break;
  }
  return all;
}

const cache = new Map();
function cached(key, ttlMs, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttlMs) return Promise.resolve(hit.data);
  return fn().then(data => { cache.set(key, { data, ts: Date.now() }); return data; });
}

// ── Normalize a raw Congress.gov member object ────────────────────────────────
// The list endpoint returns a lightweight shape — we derive chamber from
// termType ("sen" = senator, anything else = representative) which IS present.
function normalizeMember(m, chamberHint) {
  // Determine chamber from the termType field (present in list results)
  const termType = m.termType || m.terms?.[m.terms.length - 1]?.type || "";
  const isSen    = termType === "sen" || chamberHint === "senate";

  // Name: API returns "Last, First" format in list endpoint
  const rawName   = m.name || "";
  const parts     = rawName.split(",").map(s => s.trim());
  const lastName  = parts[0] || "";
  const firstName = parts[1] || m.firstName || "";

  // Terms — present on detail endpoint, absent on list endpoint
  const terms    = m.terms || [];
  const since    = terms[0]?.startYear?.toString()
                ?? terms[0]?.start?.slice(0, 4)
                ?? null;
  const termEnds = terms[terms.length - 1]?.endYear?.toString()
                ?? terms[terms.length - 1]?.end?.slice(0, 4)
                ?? null;

  return {
    bioguideId:       m.bioguideId,
    name:             rawName,
    firstName,
    lastName,
    party:            m.partyName || m.party || "Unknown",
    state:            m.state || "—",
    district:         isSen ? null : (m.district ?? null),
    chamber:          isSen ? "senate" : "house",
    since,
    termEnds,
    missedVotesPct:   m.missedVotesPercent ?? null,
    sponsoredCount:   m.sponsoredLegislation?.count ?? null,
    cosponsoredCount: m.cosponsoredLegislation?.count ?? null,
    imageUrl:         m.depiction?.imageUrl ?? m.imageUrl ?? null,
    url:              m.officialWebsiteUrl ?? m.url ?? null,
  };
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "CivicLens Proxy",
    congress_key_set: !!CONGRESS_KEY,
    current_congress: CURRENT_CONG,
    endpoints: [
      "GET /api/members?chamber=senate|house",
      "GET /api/members/:bioguideId",
      "GET /api/members/:bioguideId/votes",
      "GET /api/members/:bioguideId/sponsored",
      "GET /api/bills",
    ],
  });
});

// GET /api/members?chamber=senate|house
// Fetches ALL members (all pages), then filters by chamber client-side on the
// server — because Congress.gov's chamber filter is unreliable on the list endpoint.
app.get("/api/members", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const chamberFilter = (req.query.chamber || "").toLowerCase(); // "senate" | "house" | "" = all

    // Cache the full member list (all pages) for 1 hour
    const allRaw = await cached(`all-members-${CURRENT_CONG}`, 60 * 60 * 1000, () =>
      fetchAllPages(`/member/congress/${CURRENT_CONG}`, { currentMember: "true" })
    );

    let members = allRaw.map(m => normalizeMember(m));

    // Filter by chamber if requested
    if (chamberFilter === "senate") {
      members = members.filter(m => m.chamber === "senate");
    } else if (chamberFilter === "house") {
      members = members.filter(m => m.chamber === "house");
    }

    res.json({
      members,
      totalCount: members.length,
      chamber: chamberFilter || "all",
    });
  } catch (err) {
    console.error("/api/members error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/members/:bioguideId — full detail (includes terms, committees, etc.)
app.get("/api/members/:bioguideId", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const { bioguideId } = req.params;
    const data = await cached(`member-detail-${bioguideId}`, 60 * 60 * 1000, () =>
      congressFetch(`/member/${bioguideId}`)
    );

    const raw = data.member || data;
    res.json(normalizeMember(raw));
  } catch (err) {
    console.error("/api/members/:id error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/members/:bioguideId/votes?limit=20
app.get("/api/members/:bioguideId/votes", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const { bioguideId } = req.params;
    const limit = Math.min(parseInt(req.query.limit || "20"), 50);

    const data = await cached(`votes-${bioguideId}-${limit}`, 30 * 60 * 1000, () =>
      congressFetch(`/member/${bioguideId}/votes`, { limit })
    );

    const votes = (data.votes || []).map(v => ({
      bill:     v.vote?.description || v.description || "Legislative Vote",
      desc:     v.vote?.question    || "—",
      date:     v.date
                  ? new Date(v.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "—",
      category: categorizeVote(v.vote?.category || ""),
      vote:     normalizeVote(v.memberVoted || v.position),
      congress: v.vote?.congress ?? null,
      chamber:  v.vote?.chamber  ?? null,
    }));

    res.json({ votes });
  } catch (err) {
    console.error("/api/votes error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/members/:bioguideId/sponsored?limit=10
app.get("/api/members/:bioguideId/sponsored", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const { bioguideId } = req.params;
    const limit = Math.min(parseInt(req.query.limit || "10"), 50);

    const data = await cached(`sponsored-${bioguideId}`, 60 * 60 * 1000, () =>
      congressFetch(`/member/${bioguideId}/sponsored-legislation`, { limit })
    );

    res.json({ bills: data.sponsoredLegislation || [] });
  } catch (err) {
    console.error("/api/sponsored error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/bills?limit=20&offset=0
app.get("/api/bills", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const limit  = Math.min(parseInt(req.query.limit || "20"), 250);
    const offset = parseInt(req.query.offset || "0");

    const data = await cached(`bills-${limit}-${offset}`, 30 * 60 * 1000, () =>
      congressFetch(`/bill/${CURRENT_CONG}`, { limit, offset, sort: "updateDate+desc" })
    );

    res.json({ bills: data.bills || [], pagination: data.pagination });
  } catch (err) {
    console.error("/api/bills error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── Utility functions ─────────────────────────────────────────────────────────
function normalizeVote(pos) {
  if (!pos) return "Abstain";
  const p = pos.toLowerCase();
  if (p.includes("yea") || p.includes("yes") || p === "aye") return "Yea";
  if (p.includes("nay") || p.includes("no"))                  return "Nay";
  return "Abstain";
}

function categorizeVote(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("defense") || c.includes("military") || c.includes("armed"))    return "Defense";
  if (c.includes("health")  || c.includes("medicare") || c.includes("medicaid")) return "Healthcare";
  if (c.includes("tax")     || c.includes("budget")   || c.includes("econom"))   return "Economy";
  if (c.includes("environ") || c.includes("climate")  || c.includes("energy"))   return "Environment";
  if (c.includes("immigr")  || c.includes("border"))                             return "Immigration";
  if (c.includes("tech")    || c.includes("cyber")    || c.includes("data"))     return "Technology";
  if (c.includes("educat")  || c.includes("school"))                             return "Education";
  if (c.includes("housing") || c.includes("urban"))                              return "Housing";
  return "Legislative";
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nCivicLens Proxy running on port ${PORT}`);
  console.log(`Congress.gov API key: ${CONGRESS_KEY ? "✓ set" : "✗ MISSING — set CONGRESS_API_KEY env var"}`);
  console.log(`Health check: http://localhost:${PORT}/\n`);
});

