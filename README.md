# Gsm Technology (educational prototype)

This repository is an educational/local prototype that mirrors the look-and-feel of a commercial site for learning purposes only.

Contents
- `index.html`, `styles.css`, `app.js` — static frontend prototype
- `products.json` — local product catalog used by the frontend
- `tools/` — helper scripts (mock checkout server, scrapers)
- `data/` — runtime data (orders, invoices, stock)

Important: Do not publish any private credentials or the `data/` contents publicly. The `data/` folder is ignored in `.gitignore` by default.

How to push (securely)
1. Install Git: https://git-scm.com/
2. Configure your git identity:

```pwsh
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

3. (Optional) Create and use an SSH key and add it to GitHub for secure pushes: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

4. Create the remote repo on GitHub (you already have: `https://github.com/swaju3/gsmtechnology`).

5. Add remote and push (replace `origin` if different):

```pwsh
cd path/to/gsm-clone
git init
git add .
git commit -m "Initial commit: Gsm Technology prototype"
git branch -M main
git remote add origin https://github.com/swaju3/gsmtechnology.git
# If using HTTPS credential flow, you'll be prompted for username and password (or PAT) securely.
git push -u origin main
```

If you prefer using the GitHub CLI (`gh`) you can run:

```pwsh
gh auth login
gh repo create swaju3/gsmtechnology --public --source=. --remote=origin --push
```

If you'd like, I can guide you step-by-step or prepare the local commit and show the exact push commands for your environment. I will not use any tokens you paste here — please keep tokens private.
Gsm Technology - static prototype

This repository is a small static prototype created for educational purposes to replicate the look-and-feel and basic functionality of https://gsmserver.com/en/.

What is included
- `index.html` - Home with hero and featured products
- `products.html` - Products listing powered by `products.json`
- `product.html` - Product detail template (uses `?id=`)
- `pricing.html` - Pricing tiers
- `support.html` - Support and contact form
- `styles.css` - Basic styling
- `app.js` - JS to load products, search, cart simulation and a simple chat widget
- `products.json` - Sample product data

How to run locally
1. Open `index.html` in your browser directly for a quick preview.
2. Or, run a local static server (recommended). In PowerShell (Windows):

```powershell
# simple python server (requires Python)
python -m http.server 8000
# then open http://localhost:8000
```

Create a GitHub repo and push
1. Create an empty repo on GitHub (no README)
2. From this folder in PowerShell:

```powershell
git init
git add .
git commit -m "Initial Gsm Technology prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Notes
- This is a starting prototype. To fully match a production site you'd add a real backend, CMS, product images, payment integration, authentication, and accessibility improvements.
- You told me you have permission to copy for educational purposes — keep any copyrighted text or assets you copy under that permission.

Next steps I can take
- Improve design to more closely match the target site
- Add user accounts, orders, and a simple Node/Express backend
- Integrate a real chat provider (Twilio/Intercom) and webhooks
- Add automated tests and CI

If you want, I can push this to a new GitHub repo for you (I'll need a personal access token or you can create the repo and I will provide commands).