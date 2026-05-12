# 📄 Resume Maker

A clean, free, no-login resume builder with AI-powered ATS checker.

**Developer:** Iyyappan S  
**Live Demo:** `https://<your-username>.github.io/resume-maker/`

---

## ✨ Features

- **4 Resume Templates** – Classic, Modern, Minimal, Executive
- **AI ATS Checker** – Powered by Claude AI (Anthropic)
- **No Login Required** – Works 100% in the browser
- **Free to Use** – No hidden fees or subscriptions
- **Downloadable Resume** – Export as HTML (print to PDF from browser)

---

## 🚀 Deploy to GitHub Pages (Free Hosting)

### Step 1 – Create Repository
1. Go to [github.com](https://github.com) → **New Repository**
2. Name it: `resume-maker`
3. Set to **Public**
4. Click **Create Repository**

### Step 2 – Upload Files
Upload these 3 files to the repository root:
```
index.html
styles.css
app.js
```

### Step 3 – Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select `main` branch, `/ (root)` folder
3. Click **Save**
4. Your site will be live at: `https://<your-username>.github.io/resume-maker/`

> ⏱ GitHub Pages usually takes 1–3 minutes to go live after the first deploy.

---

## 🤖 ATS Checker – How It Works

The ATS checker uses the **Anthropic Claude API** directly from the browser.

**Important:** The API call is made directly from the user's browser. For this to work on GitHub Pages (HTTPS), Anthropic's API must support CORS from browser origins. If you encounter CORS issues, you can:

1. **Option A:** Set up a tiny proxy server on Vercel/Netlify (free) — see `proxy-setup.md` (optional)
2. **Option B:** The app gracefully shows an error message and tells users how to resolve it

---

## 📁 File Structure

```
resume-maker/
├── index.html      ← Main HTML structure
├── styles.css      ← All styles
├── app.js          ← All JavaScript logic + API calls
└── README.md       ← This file
```

---

## 🛠 Local Development

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js
npx serve .

# Then open: http://localhost:8080
```

> Note: Open via a server (not file://) so API calls work correctly.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ by Iyyappan S*
