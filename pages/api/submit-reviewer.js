// pages/api/submit-reviewer.js
// Receives reviewer form submissions → writes to Notion as "Pending"

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
      "LinkedIn":     { rich_text: [{ text: { content: identity.linkedin || "" } }] },
      "Bio":          { rich_text: [{ text: { content: truncate(identity.bio || "", 1900) } }] },
      "Disclosure":   { rich_text: [{ text: { content: identity.disclosure || "No financial relationships declared" } }] },
      "Stack":        { rich_text: [{ text: { content: truncate(JSON.stringify({
        techStack: (stack || []).join(", "),
        scores: Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, r.scores || {}])),
        verdicts: Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, { verdict: r.verdict || "", take: r.take || "" }])),
        usage: Object.fromEntries(Object.entries(toolReviews || {}).map(([id, r]) => [id, r.used || false])),
        scoringNote: philosophy?.scoringNote || "",
        beliefs: (philosophy?.beliefs || []).join(" | "),
        painPoints: (philosophy?.painPoints || []).join(" | "),
      })) } }] },
      "Submitted At": { date: { start: submittedAt || new Date().toISOString() } },
    },
    children: [
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Reviewer Profile" } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: "Bio: " + (identity.bio || "") } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: "Disclosure: " + (identity.disclosure || "None declared") } }] } },
      ...(identity.linkedin ? [{ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: "LinkedIn: " + identity.linkedin } }] } }] : []),
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Tech Stack" } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: (stack || []).join(", ") || "Not specified" } }] } },
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Tool Reviews" } }] } },
      ...Object.entries(toolReviews || {}).filter(([,r]) => r.verdict).map(([id, r]) => ({
        object: "block", type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: "Tool " + id + " | " + (r.verdict || "") + " | " + (r.take || "") } }] }
      })),
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
      console.error("Notion error:", JSON.stringify(err));
      return res.status(500).json({ message: err.message || "Notion write failed", details: err });
    }

    const page = await r.json();
    return res.status(200).json({ success: true, id: page.id });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
