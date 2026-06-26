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

function congressUrl(path, params = {}) {
  const url = new URL(`${CONGRESS_BASE}${path}`);
  url.searchParams.set("api_key", CONGRESS_KEY);
  url.searchParams.set("format", "json");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

async function congressFetch(path, params = {}) {
  const res = await fetch(congressUrl(path, params));
  if (!res.ok) throw new Error(`Congress.gov ${res.status}`);
  return res.json();
}

// Fetch every page until we have all members
async function fetchAllMembers() {
  let all = [];
  let offset = 0;
  const limit = 250;
  while (true) {
    const data = await congressFetch(`/member/congress/${CURRENT_CONG}`, {
      currentMember: "true", limit, offset
    });
    const items = data.members || [];
    all = [...all, ...items];
    const total = data.pagination?.count ?? items.length;
    offset += limit;
    if (items.length < limit || offset >= total) break;
  }
  return all;
}

const cache = new Map();
function cached(key, ttlMs, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttlMs) return Promise.resolve(hit.data);
  return fn().then(data => { cache.set(key, { data, ts: Date.now() }); return data; });
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "CivicLens Proxy", congress_key_set: !!CONGRESS_KEY });
});

// GET /api/debug — returns first 3 raw members so we can see exact field names
app.get("/api/debug", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "No API key" });
    const data = await congressFetch(`/member/congress/${CURRENT_CONG}`, {
      currentMember: "true", limit: 3
    });
    res.json({
      total: data.pagination?.count,
      keys: Object.keys(data.members?.[0] || {}),
      members: data.members
    });
  } catch(e) { res.status(502).json({ error: e.message }); }
});

// GET /api/members — returns ALL members, no chamber filtering
// The front-end will distinguish senators vs reps using the district field:
// senators have district=null, representatives have a district number
app.get("/api/members", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set" });

    const allRaw = await cached(`members-${CURRENT_CONG}`, 60 * 60 * 1000, fetchAllMembers);

    const members = allRaw.map(m => ({
      bioguideId:  m.bioguideId,
      name:        m.name,
      party:       m.partyName || m.party || "Unknown",
      state:       m.state    || "—",
      district:    m.district ?? null,   // null = senator, number = representative
      since:       m.startYear?.toString() ?? null,
      termEnds:    m.endYear?.toString()  ?? null,
      imageUrl:    m.depiction?.imageUrl  ?? null,
      url:         m.url                  ?? null,
      // Pass through every other field so the front-end can inspect them
      _raw:        m,
    }));

    res.json({ members, totalCount: members.length });
  } catch(e) {
    console.error(e.message);
    res.status(502).json({ error: e.message });
  }
});

// GET /api/members/:bioguideId/votes
app.get("/api/members/:bioguideId/votes", async (req, res) => {
  try {
    if (!CONGRESS_KEY) return res.status(500).json({ error: "CONGRESS_API_KEY not set" });
    const { bioguideId } = req.params;
    const limit = Math.min(parseInt(req.query.limit || "20"), 50);
    const data = await cached(`votes-${bioguideId}`, 30 * 60 * 1000, () =>
      congressFetch(`/member/${bioguideId}/votes`, { limit })
    );
    const votes = (data.votes || []).map(v => ({
      bill:     v.vote?.description || "Legislative Vote",
      desc:     v.vote?.question    || "—",
      date:     v.date ? new Date(v.date).toLocaleDateString("en-US", { month:"short", year:"numeric" }) : "—",
      category: "Legislative",
      vote:     normalizeVote(v.memberVoted || v.position),
    }));
    res.json({ votes });
  } catch(e) { res.status(502).json({ error: e.message }); }
});

function normalizeVote(pos) {
  if (!pos) return "Abstain";
  const p = pos.toLowerCase();
  if (p.includes("yea") || p.includes("yes") || p === "aye") return "Yea";
  if (p.includes("nay") || p.includes("no"))                  return "Nay";
  return "Abstain";
}

app.listen(PORT, () => console.log(`CivicLens Proxy on port ${PORT} — key: ${CONGRESS_KEY ? "set" : "MISSING"}`));
