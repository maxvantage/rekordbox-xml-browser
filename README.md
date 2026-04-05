# Rekordbox XML Browser

A dark-mode web app for browsing a Rekordbox XML library. Sortable/filterable track table, playlist sidebar, cue point viewer, BPM/key/genre filters.

## Stack

- **Backend:** Node.js + Express, parses the XML on startup, serves a JSON API
- **Frontend:** React + Vite + Tailwind CSS, virtual-scrolled track table

## Local Development

### Prerequisites

- Node.js 20+
- Your `rekordbox.xml` exported from Rekordbox (File → Export Collection in xml format)

### Setup

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Place your rekordbox.xml in the repo root (it's gitignored)
cp /path/to/rekordbox.xml ./rekordbox.xml
```

### Run (two terminals)

```bash
# Terminal 1 — API server (port 3001)
cd server && npm run dev

# Terminal 2 — Vite dev server (port 5173, proxies /api to 3001)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
cd client && npm run build
cd ../server && npm start
```

The server serves the built client from `client/dist` and the API from `localhost:3001` (or `$PORT`).

## Deploy to Railway

`rekordbox.xml` is gitignored but gets baked into the Docker image at deploy
time. Railway CLI respects `.gitignore` by default, so pass `--no-gitignore`
to include it. The `.dockerignore` file still protects `.env`, `node_modules`,
etc.

```bash
# First time
npm install -g @railway/cli
railway login          # opens browser — sign up at railway.app (free)
railway init           # creates a new project, links this directory

# Deploy (bakes rekordbox.xml into the image)
railway up --no-gitignore --detach

# Create a public URL
railway domain
```

**To redeploy after updating your library:**
```bash
# Export new rekordbox.xml from Rekordbox → overwrite the file → then:
railway up --no-gitignore --detach
```

## Environment variables

| Variable   | Default               | Description                    |
|------------|-----------------------|--------------------------------|
| `PORT`     | `3001`                | HTTP port                      |
| `XML_PATH` | `../rekordbox.xml`    | Path to the Rekordbox XML file |

## Features

- **Track table** — sortable by any column, virtualized for smooth scrolling through 1000+ tracks
- **Global search** — searches artist, title, album, genre, comments, label, remixer
- **BPM filter** — min/max range inputs
- **Key filter** — Camelot notation buttons (A = minor, B = major)
- **Genre filter** — clickable genre tags
- **Rating filter** — min-star threshold (0–5)
- **Playlist sidebar** — collapsible folder tree matching your Rekordbox playlists
- **Cue points** — expand any row to see cue points with timestamps and colors
- **Spotify imports** — visually flagged with a wifi icon (Kind = "Unknown Format")
