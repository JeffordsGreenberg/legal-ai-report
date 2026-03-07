// pages/api/submit-reviewer.js
// Receives reviewer form submissions → writes to Notion as "Pending"
// You approve in Notion → status "Approved" → live on next load
//
// ENV VARS (set in Vercel dashboard):
//   NOTION_API_KEY        — starts with secret_...
//   NOTION_DB_REVIEWERS   — 32-char database ID from Notion page URL

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { identity, stack, philosophy, toolReviews, submittedAt } = req.body;

  if (!identity?.name || !identity?.role || !identity?.bio)
    return res.status(400).json({ message: "Missing required fields: name, role, bio" });

  const KEY = process.env.NOTION_API_KEY;
  const DB  = process.env.NOTION_DB_REVIEWERS;
  if (!KEY || !DB) return res.status(500).json({ message: "Server configuration error" });

  const truncate = (str, n = 1900) => (str || "").substring(0, n);

  const payload = {
    parent: { database_id: DB },
    properties: {
      "Name":         { title:     [{ text: { content: identity.name } }] },
      "Status":       { select:    { name: "Pending" } },
      "Role":         { rich_text: [{ text: { content: identity.role || "" } }] },
      "Sector":       { rich_text: [{ text: { content: identity.sector || "" } }] },
      "Company Size": { rich_text: [{ text: { content: identity.companySize || "" } }] },
      "Team Size":    { rich_text: [{ text: { content: identity.teamSize || "" } }] },
      "LinkedIn":     { url: identity.linkedin || null },
      "Bio":          { rich_text: [{ text: { content: identity.bio || "" } }] },
      "Disclosure":   { rich_text: [{ text: { content: identity.disclosure || "No financial relationships declared" } }] },
      "Stack":        { rich_text: [{ text: { content: (stack || []).join(", ") } }] },
      "Scores":       { rich_text: [{ text: { content: truncate(JSON.stringify(
        Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, r.scores || {}]))
      )) } }] },
      "Verdicts":     { rich_text: [{ text: { content: truncate(JSON.stringify(
        Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, r.verdict || ""]))
      )) } }] },
      "Takes":        { rich_text: [{ text: { content: truncate(JSON.stringify(
        Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, r.take || ""]))
      )) } }] },
      "Usage":        { rich_text: [{ text: { content: truncate(JSON.stringify(
        Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, r.used || false]))
      )) } }] },
      "Scoring Note": { rich_text: [{ text: { content: philosophy?.scoringNote || "" } }] },
      "Beliefs":      { rich_text: [{ text: { content: (philosophy?.beliefs || []).join(" | ") } }] },
      "Pain Points":  { rich_text: [{ text: { content: (philosophy?.painPoints || []).join(" | ") } }] },
      "Submitted At": { date: { start: submittedAt || new Date().toISOString() } },
    },
    children: [
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `Bio: ${identity.bio}` } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `Disclosure: ${identity.disclosure || "None declared"}` } }] } },
    ],
  };

  try {
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const err = await r.json();
      console.error("Notion error:", err);
      return res.status(500).json({ message: err.message || "Notion write failed" });
    }

    const page = await r.json();
    return res.status(200).json({ success: true, id: page.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
