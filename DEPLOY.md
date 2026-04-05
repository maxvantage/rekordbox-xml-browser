# Deploy Reference

**Repo:** https://github.com/maxvantage/rekordbox-xml-browser

> `rekordbox.xml` is gitignored — never pushed to GitHub, but included in Railway deploys via `--no-gitignore`.

---

## Run locally

```bash
# Terminal 1
cd server && npm run dev       # API on :3001

# Terminal 2
cd client && npm run dev       # UI on :5173
```

---

## Deploy to Railway

```bash
railway up --no-gitignore --detach
railway domain                 # get/create public URL
```

First time only:
```bash
npm install -g @railway/cli
railway login
railway init
```

---

## Update after re-exporting XML

1. Export `rekordbox.xml` from Rekordbox → overwrite file in project root
2. `railway up --no-gitignore --detach`
