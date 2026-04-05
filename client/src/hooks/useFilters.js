import { useState, useMemo } from 'react';

// Camelot harmonic mixing: same key, relative (same num other letter), ±1 number same letter
export function getHarmonicKeys(rootKey, includeHarmonics) {
  if (!rootKey) return new Set();
  const match = rootKey.match(/^(\d+)([AB])$/);
  if (!match) return new Set([rootKey]);
  if (!includeHarmonics) return new Set([rootKey]);
  const num = parseInt(match[1]);
  const letter = match[2];
  const other = letter === 'A' ? 'B' : 'A';
  const prev = num === 1 ? 12 : num - 1;
  const next = num === 12 ? 1 : num + 1;
  return new Set([
    `${num}${letter}`,   // exact match
    `${num}${other}`,    // relative major/minor
    `${prev}${letter}`,  // energy drop
    `${next}${letter}`,  // energy boost
  ]);
}

export function useFilters(tracks) {
  const [search, setSearch]         = useState('');
  const [bpmMin, setBpmMin]         = useState('');
  const [bpmMax, setBpmMax]         = useState('');
  const [keyRoot, setKeyRoot]       = useState(null);   // e.g. "8A" or null
  const [keyHarmonics, setKeyHarmonics] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [minRating, setMinRating]   = useState(0);
  const [playlistTrackIds, setPlaylistTrackIds] = useState(null);
  const [sortCol, setSortCol]       = useState('artist');
  const [sortDir, setSortDir]       = useState('asc');

  const activeKeys = useMemo(
    () => getHarmonicKeys(keyRoot, keyHarmonics),
    [keyRoot, keyHarmonics]
  );

  const filtered = useMemo(() => {
    let result = tracks;

    if (playlistTrackIds !== null) {
      const idSet = new Set(playlistTrackIds);
      result = result.filter(t => idSet.has(t.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q) ||
        t.comments.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q) ||
        t.remixer.toLowerCase().includes(q)
      );
    }

    const bMin = parseFloat(bpmMin);
    const bMax = parseFloat(bpmMax);
    if (!isNaN(bMin)) result = result.filter(t => t.bpm !== null && t.bpm >= bMin);
    if (!isNaN(bMax)) result = result.filter(t => t.bpm !== null && t.bpm <= bMax);

    if (activeKeys.size > 0) {
      result = result.filter(t => activeKeys.has(t.key));
    }

    if (selectedGenres.size > 0) {
      result = result.filter(t => selectedGenres.has(t.genre.trim()));
    }

    if (minRating > 0) {
      result = result.filter(t => t.rating >= minRating);
    }

    result = [...result].sort((a, b) => {
      let av = a[sortCol];
      let bv = b[sortCol];
      if (av === null || av === undefined) av = '';
      if (bv === null || bv === undefined) bv = '';
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tracks, search, bpmMin, bpmMax, activeKeys, selectedGenres, minRating, playlistTrackIds, sortCol, sortDir]);

  function toggleGenre(genre) {
    setSelectedGenres(prev => {
      const next = new Set(prev);
      next.has(genre) ? next.delete(genre) : next.add(genre);
      return next;
    });
  }

  function handleSort(col) {
    if (col === sortCol) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  function clearFilters() {
    setSearch('');
    setBpmMin('');
    setBpmMax('');
    setKeyRoot(null);
    setKeyHarmonics(false);
    setSelectedGenres(new Set());
    setMinRating(0);
    setPlaylistTrackIds(null);
  }

  const hasActiveFilters =
    !!search || !!bpmMin || !!bpmMax ||
    keyRoot !== null || selectedGenres.size > 0 ||
    minRating > 0 || playlistTrackIds !== null;

  return {
    filtered,
    search, setSearch,
    bpmMin, setBpmMin,
    bpmMax, setBpmMax,
    keyRoot, setKeyRoot,
    keyHarmonics, setKeyHarmonics,
    activeKeys,
    selectedGenres, toggleGenre,
    minRating, setMinRating,
    playlistTrackIds, setPlaylistTrackIds,
    sortCol, sortDir, handleSort,
    clearFilters,
    hasActiveFilters,
  };
}
