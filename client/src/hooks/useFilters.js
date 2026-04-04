import { useState, useMemo } from 'react';

export function useFilters(tracks) {
  const [search, setSearch]             = useState('');
  const [bpmMin, setBpmMin]             = useState('');
  const [bpmMax, setBpmMax]             = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [minRating, setMinRating]       = useState(0);
  const [playlistTrackIds, setPlaylistTrackIds] = useState(null); // null = all
  const [sortCol, setSortCol]           = useState('artist');
  const [sortDir, setSortDir]           = useState('asc');

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

    if (selectedKeys.size > 0) {
      result = result.filter(t => selectedKeys.has(t.key));
    }

    if (selectedGenres.size > 0) {
      result = result.filter(t => selectedGenres.has(t.genre.trim()));
    }

    if (minRating > 0) {
      result = result.filter(t => t.rating >= minRating);
    }

    // Sort
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
  }, [tracks, search, bpmMin, bpmMax, selectedKeys, selectedGenres, minRating, playlistTrackIds, sortCol, sortDir]);

  function toggleKey(key) {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

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
    setSelectedKeys(new Set());
    setSelectedGenres(new Set());
    setMinRating(0);
    setPlaylistTrackIds(null);
  }

  const hasActiveFilters = search || bpmMin || bpmMax || selectedKeys.size > 0 || selectedGenres.size > 0 || minRating > 0 || playlistTrackIds !== null;

  return {
    filtered,
    search, setSearch,
    bpmMin, setBpmMin,
    bpmMax, setBpmMax,
    selectedKeys, toggleKey,
    selectedGenres, toggleGenre,
    minRating, setMinRating,
    playlistTrackIds, setPlaylistTrackIds,
    sortCol, sortDir, handleSort,
    clearFilters,
    hasActiveFilters,
  };
}
