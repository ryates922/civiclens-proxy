const express = require("express");
const cors    = require("cors");
const fetch   = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS — allow any origin so the web app and mobile app both work ───────────
app.use(cors());
app.use(express.json());

// ── Config ────────────────────────────────────────────────────────────────────
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

// Simple in-memory cache to avoid hammering the upstream APIs
const cache = new Map();
function cached(key, ttlMs, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttlMs) return Promise.resolve(hit.data);
  return fn().then(data => { cache.set(key, { data, ts: Date.now() }); return data; });
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "CivicLens Proxy",
    congress_key_set: !!CONGRESS_KEY,
    current_congress: CURRENT_CONG,
  });
});

// GET /api/members?chamber=senate|house&limit=250&offset=0
app.get("/api/members", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const chamber = req.query.chamber || "senate";
    const limit   = Math.min(parseInt(req.query.limit  || "250"), 250);
    const offset  = parseInt(req.query.offset || "0");
    const cacheKey = `members-${chamber}-${limit}-${offset}`;

    const data = await cached(cacheKey, 60 * 60 * 1000, () =>
      congressFetch(`/member/congress/${CURRENT_CONG}`, {
        chamber,
        limit,
        offset,
        currentMember: "true",
      })
    );

    // Normalize to a consistent shape
    const members = (data.members || []).map(m => ({
      bioguideId:       m.bioguideId,
      name:             m.name,
      firstName:        m.firstName,
      lastName:         m.lastName,
      party:            m.partyName || m.party,
      state:            m.state,
      district:         m.district ?? null,
      chamber:          chamber,
      since:            m.terms?.[0]?.startYear?.toString() ?? null,
      termEnds:         m.terms?.[m.terms.length - 1]?.endYear?.toString() ?? null,
      missedVotesPct:   m.missedVotesPercent ?? null,
      sponsoredCount:   m.sponsoredLegislation?.count ?? null,
      cosponsoredCount: m.cosponsoredLegislation?.count ?? null,
      imageUrl:         m.depiction?.imageUrl ?? null,
      url:              m.url ?? null,
    }));

    res.json({
      members,
      pagination: data.pagination,
      totalCount: data.pagination?.count ?? members.length,
    });
  } catch (err) {
    console.error("/api/members error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/members/:bioguideId — single member detail
app.get("/api/members/:bioguideId", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const { bioguideId } = req.params;
    const data = await cached(`member-${bioguideId}`, 60 * 60 * 1000, () =>
      congressFetch(`/member/${bioguideId}`)
    );

    res.json(data.member || data);
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
    const cacheKey = `votes-${bioguideId}-${limit}`;

    const data = await cached(cacheKey, 30 * 60 * 1000, () =>
      congressFetch(`/member/${bioguideId}/votes`, { limit })
    );

    const votes = (data.votes || []).map(v => ({
      bill:     v.vote?.description || v.description || "Legislative Vote",
      desc:     v.vote?.question    || "—",
      date:     v.date
                  ? new Date(v.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "—",
      category: v.vote?.category || "Legislative",
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

// GET /api/bills?congress=119&limit=20&offset=0&sort=updateDate+desc
app.get("/api/bills", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const congress = req.query.congress || CURRENT_CONG;
    const limit    = Math.min(parseInt(req.query.limit || "20"), 250);
    const offset   = parseInt(req.query.offset || "0");
    const sort     = req.query.sort || "updateDate+desc";

    const data = await cached(`bills-${congress}-${limit}-${offset}`, 30 * 60 * 1000, () =>
      congressFetch(`/bill/${congress}`, { limit, offset, sort })
    );

    res.json({ bills: data.bills || [], pagination: data.pagination });
  } catch (err) {
    console.error("/api/bills error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/bills/:congress/:type/:number — single bill detail
app.get("/api/bills/:congress/:type/:number", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set on server" });

    const { congress, type, number } = req.params;
    const data = await cached(`bill-${congress}-${type}-${number}`, 60 * 60 * 1000, () =>
      congressFetch(`/bill/${congress}/${type}/${number}`)
    );

    res.json(data.bill || data);
  } catch (err) {
    console.error("/api/bills/:id error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizeVote(pos) {
  if (!pos) return "Abstain";
  const p = pos.toLowerCase();
  if (p.includes("yea") || p.includes("yes") || p === "aye") return "Yea";
  if (p.includes("nay") || p.includes("no"))                  return "Nay";
  return "Abstain";
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nCivicLens Proxy running on port ${PORT}`);
  console.log(`Congress.gov API key: ${CONGRESS_KEY ? "✓ set" : "✗ MISSING — set CONGRESS_API_KEY env var"}`);
  console.log(`Health check: http://localhost:${PORT}/\n`);
});
