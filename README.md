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

1. Push this repo to GitHub
2. Create a new Railway project from the repo
3. Add a volume and mount `rekordbox.xml` to `/app/rekordbox.xml`
   (or set `XML_PATH` env var pointing to your file)
4. Railway auto-detects the Dockerfile

## Deploy to Fly.io

```bash
fly launch       # follow prompts
fly deploy
```

Set the `XML_PATH` secret to wherever you upload the XML:

```bash
fly secrets set XML_PATH=/data/rekordbox.xml
fly volumes create rekordbox_data --size 1
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
