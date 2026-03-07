// pages/api/anthropic-proxy.js
// Proxies Anthropic API calls so the key never touches the browser.
// The app calls /api/anthropic-proxy instead of api.anthropic.com directly.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ message: "Missing ANTHROPIC_API_KEY" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Anthropic proxy error:", err);
    return res.status(500).json({ message: "Proxy error", detail: err.message });
  }
}
