import { useState, useEffect } from 'react';

export function useLibrary() {
  const [tracks, setTracks]   = useState([]);
  const [genres, setGenres]   = useState([]);
  const [keys, setKeys]       = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [t, g, k, p] = await Promise.all([
          fetch('/api/tracks').then(r => r.json()),
          fetch('/api/genres').then(r => r.json()),
          fetch('/api/keys').then(r => r.json()),
          fetch('/api/playlists').then(r => r.json()),
        ]);
        setTracks(t);
        setGenres(g);
        setKeys(k);
        setPlaylists(p);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { tracks, genres, keys, playlists, loading, error };
}
