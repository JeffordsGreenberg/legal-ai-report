# Deploy Instructions

## What you have
- Next.js app ready to deploy
- 3 API routes: anthropic-proxy, submit-reviewer (Notion), get-reviewers (Notion)
- GitHub + Vercel already connected ✓

---

## Step 1 — Push to GitHub (5 min)

1. Go to github.com → New repository → name it `legal-ai-report` → Create
2. On your computer, open Terminal and run:

```bash
cd ~/Desktop                          # or wherever you want the folder
git clone <your new repo URL>
cd legal-ai-report
```

3. Copy everything from this folder into it, then:

```bash
git add .
git commit -m "Initial deploy"
git push origin main
```

---

## Step 2 — Deploy on Vercel (2 min)

1. Go to vercel.com → Add New Project
2. Import your `legal-ai-report` GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** — it will build and give you a URL like `legal-ai-report.vercel.app`

The app will be live but the Latest News tab and form submission won't work yet — you need the env vars below.

---

## Step 3 — Get your Anthropic API key (5 min)

1. Go to console.anthropic.com → sign up / log in
2. Click **API Keys** in the left sidebar → **Create Key**
3. Name it "legal-ai-report" → copy the key (starts with `sk-ant-...`)
4. Save it somewhere — you only see it once

---

## Step 4 — Set up Notion (15 min)

### Create the database
1. Go to notion.so → New page → Select **Table** database
2. Name it **Reviewers**
3. Add these exact columns (delete the default ones first):

| Column name    | Type     | Notes                              |
|----------------|----------|------------------------------------|
| Name           | Title    | Already exists — keep it           |
| Status         | Select   | Add options: Pending, Approved, Rejected |
| Role           | Text     |                                    |
| Sector         | Text     |                                    |
| Company Size   | Text     |                                    |
| Team Size      | Text     |                                    |
| LinkedIn       | URL      |                                    |
| Bio            | Text     |                                    |
| Disclosure     | Text     |                                    |
| Stack          | Text     |                                    |
| Scores         | Text     | Stores JSON                        |
| Verdicts       | Text     | Stores JSON                        |
| Takes          | Text     | Stores JSON                        |
| Usage          | Text     | Stores JSON                        |
| Scoring Note   | Text     |                                    |
| Beliefs        | Text     |                                    |
| Pain Points    | Text     |                                    |
| Submitted At   | Date     |                                    |

### Create an integration
1. Go to notion.so/my-integrations → **New integration**
2. Name: "legal-ai-report" → Submit
3. Copy the **Internal Integration Secret** (starts with `secret_...`)

### Connect the database to your integration
1. Open the Reviewers database in Notion
2. Click **...** (top right) → **Connections** → find your integration → Connect

### Get the database ID
Look at the URL of your Notion database page:
`https://notion.so/yourworkspace/DATABASE-ID-HERE?v=...`
The long string between the last `/` and the `?` is your database ID.

---

## Step 5 — Add env vars to Vercel (3 min)

1. Go to vercel.com → your project → **Settings** → **Environment Variables**
2. Add these three:

| Name                   | Value                        |
|------------------------|------------------------------|
| `ANTHROPIC_API_KEY`    | `sk-ant-...` (your key)      |
| `NOTION_API_KEY`       | `secret_...` (your key)      |
| `NOTION_DB_REVIEWERS`  | your database ID             |

3. Click **Save** → then go to **Deployments** → **Redeploy** (the env vars only take effect on next deploy)

---

## Step 6 — Test everything (5 min)

1. Open your live URL
2. Click a tool card → Latest News tab → should load news
3. Go to Submit Review → fill it out → submit
4. Check your Notion database — a new row should appear with Status: Pending
5. Change Status to **Approved** in Notion (future: this will make them go live automatically)

---

## Your approval workflow going forward

When someone submits a review:
1. You get a row in Notion with Status: **Pending**
2. You read through it, check their LinkedIn, verify they're real
3. If good → change Status to **Approved**
4. Future version: the app will auto-fetch approved reviewers on load

For now: approved reviewers need to be manually added to the `REVIEWERS` array in the code. That's the next thing to build — a `/api/get-reviewers` route that fetches live from Notion so you never need to redeploy just to add a reviewer.

---

## Your live URLs

After deploy you'll have:
- `your-project.vercel.app` — the report
- `your-project.vercel.app/api/submit-reviewer` — form endpoint
- `your-project.vercel.app/api/anthropic-proxy` — AI proxy

Add a custom domain in Vercel → Settings → Domains if you want `laurajg.com/legal-ai`.
