import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static client build in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// --- Parse XML ---
const XML_PATH = process.env.XML_PATH || path.join(__dirname, '../rekordbox.xml');

function parseXML() {
  const xml = readFileSync(XML_PATH, 'utf8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    isArray: (name) => ['TRACK', 'POSITION_MARK', 'TEMPO', 'NODE'].includes(name),
    allowBooleanAttributes: true,
  });
  return parser.parse(xml);
}

function formatDuration(seconds) {
  const s = parseInt(seconds) || 0;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function mapRating(raw) {
  // 0-255 scale to 0-5
  const n = parseInt(raw) || 0;
  return Math.round((n / 255) * 5);
}

function parseCues(track) {
  const marks = track.POSITION_MARK || [];
  // Only cues (Type=0), deduplicate by Num (prefer the colored one)
  const cueMap = new Map();
  for (const m of marks) {
    if (String(m.Type) !== '0') continue;
    const num = parseInt(m.Num);
    if (num < 0) continue; // memory cues without slot
    const existing = cueMap.get(num);
    // prefer entry with color data
    if (!existing || (m.Red !== undefined && existing.Red === undefined)) {
      cueMap.set(num, m);
    }
  }
  return Array.from(cueMap.values())
    .sort((a, b) => parseFloat(a.Start) - parseFloat(b.Start))
    .map(m => ({
      name: m.Name || '',
      time: parseFloat(m.Start),
      color: m.Red !== undefined
        ? `rgb(${m.Red},${m.Green},${m.Blue})`
        : null,
    }));
}

let data = null;

function loadData() {
  const parsed = parseXML();
  const root = parsed.DJ_PLAYLISTS;
  const rawTracks = root.COLLECTION.TRACK || [];

  const tracksById = new Map();
  const tracks = rawTracks.map(t => {
    const track = {
      id: String(t.TrackID),
      name: t.Name || '',
      artist: t.Artist || '',
      composer: t.Composer || '',
      album: t.Album || '',
      grouping: t.Grouping || '',
      genre: t.Genre || '',
      kind: t.Kind || '',
      size: parseInt(t.Size) || 0,
      totalTime: parseInt(t.TotalTime) || 0,
      duration: formatDuration(t.TotalTime),
      trackNumber: parseInt(t.TrackNumber) || 0,
      year: parseInt(t.Year) || null,
      bpm: parseFloat(t.AverageBpm) || null,
      dateAdded: t.DateAdded || '',
      bitRate: parseInt(t.BitRate) || 0,
      sampleRate: parseInt(t.SampleRate) || 0,
      comments: t.Comments || '',
      playCount: parseInt(t.PlayCount) || 0,
      ratingRaw: parseInt(t.Rating) || 0,
      rating: mapRating(t.Rating),
      location: t.Location || '',
      remixer: t.Remixer || '',
      label: t.Label || '',
      mix: t.Mix || '',
      key: t.Tonality || '',
      isSpotify: t.Kind === 'Unknown Format',
      cues: parseCues(t),
    };
    tracksById.set(track.id, track);
    return track;
  });

  // Collect unique genres (normalized)
  const genreSet = new Set();
  for (const t of tracks) {
    if (t.genre) genreSet.add(t.genre.trim());
  }
  const genres = Array.from(genreSet).sort((a, b) => a.localeCompare(b));

  // Camelot keys
  const keySet = new Set();
  for (const t of tracks) {
    if (t.key) keySet.add(t.key);
  }
  const keys = Array.from(keySet).sort();

  // Parse playlists
  function parseNode(node) {
    if (!node) return null;
    const type = parseInt(node.Type);
    if (type === 0) {
      // folder
      const children = (node.NODE || []).map(parseNode).filter(Boolean);
      return {
        name: node.Name,
        type: 'folder',
        count: children.reduce((s, c) => s + (c.type === 'playlist' ? c.trackIds.length : c.count), 0),
        children,
      };
    } else if (type === 1) {
      // playlist
      const trackRefs = node.TRACK || [];
      const trackIds = trackRefs.map(t => String(t.Key));
      return {
        name: node.Name,
        type: 'playlist',
        trackIds,
      };
    }
    return null;
  }

  // PLAYLISTS.NODE is an array; index 0 is the ROOT folder
  const rootNode = Array.isArray(root.PLAYLISTS.NODE)
    ? root.PLAYLISTS.NODE[0]
    : root.PLAYLISTS.NODE;
  const playlistTree = (rootNode.NODE || []).map(parseNode).filter(Boolean);

  data = { tracks, tracksById, genres, keys, playlistTree };
  console.log(`Loaded ${tracks.length} tracks`);
}

loadData();

// --- API Routes ---

app.get('/api/tracks', (req, res) => {
  res.json(data.tracks);
});

app.get('/api/genres', (req, res) => {
  res.json(data.genres);
});

app.get('/api/keys', (req, res) => {
  res.json(data.keys);
});

app.get('/api/playlists', (req, res) => {
  res.json(data.playlistTree);
});

// Fallback to client app
app.get('*', (req, res) => {
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
