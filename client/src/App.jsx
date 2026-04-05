import { useState, useMemo } from 'react';
import { Disc3, Menu } from 'lucide-react';
import { useLibrary } from './hooks/useLibrary.js';
import { useFilters } from './hooks/useFilters.js';
import { PlaylistSidebar } from './components/PlaylistSidebar.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { TrackTable } from './components/TrackTable.jsx';

export default function App() {
  const { tracks, genres, playlists, loading, error } = useLibrary();
  const filters = useFilters(tracks);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const genreCounts = useMemo(() => {
    const counts = {};
    for (const t of tracks) {
      if (t.genre) {
        const g = t.genre.trim();
        counts[g] = (counts[g] || 0) + 1;
      }
    }
    return counts;
  }, [tracks]);

  function handlePlaylistSelect(node) {
    setSelectedPlaylist(node);
    filters.setPlaylistTrackIds(node.trackIds);
  }

  function handleClearPlaylist() {
    setSelectedPlaylist(null);
    filters.setPlaylistTrackIds(null);
  }

  function handleClearAll() {
    filters.clearFilters();
    setSelectedPlaylist(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0d12]">
        <div className="flex flex-col items-center gap-4">
          <Disc3 className="text-violet-500 animate-spin" size={48} />
          <p className="text-gray-400 text-sm">Loading library…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0d12]">
        <div className="text-center space-y-2">
          <p className="text-red-400 font-medium">Failed to load library</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <p className="text-gray-500 text-xs">Is the server running? <code className="bg-white/5 px-1 rounded">cd server && npm start</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0d0d12] overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-2 px-3 py-2.5 bg-[#13131a] border-b border-white/5 shrink-0">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden p-1 text-gray-400 hover:text-gray-200 transition-fast"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open playlists"
        >
          <Menu size={18} />
        </button>

        <Disc3 size={18} className="text-violet-500 shrink-0" />
        <h1 className="text-sm font-semibold text-gray-100 tracking-wide">Rekordbox XML Browser</h1>

        {selectedPlaylist && (
          <span className="text-sm text-gray-500 truncate min-w-0">
            / <span className="text-violet-400">{selectedPlaylist.name}</span>
          </span>
        )}
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — handles its own mobile/desktop presentation */}
        <PlaylistSidebar
          playlists={playlists}
          onSelect={handlePlaylistSelect}
          selectedPlaylist={selectedPlaylist}
          onClearPlaylist={handleClearPlaylist}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex flex-col flex-1 min-w-0">
          <FilterBar
            search={filters.search}
            setSearch={filters.setSearch}
            bpmMin={filters.bpmMin}
            setBpmMin={filters.setBpmMin}
            bpmMax={filters.bpmMax}
            setBpmMax={filters.setBpmMax}
            keyRoot={filters.keyRoot}
            setKeyRoot={filters.setKeyRoot}
            keyHarmonics={filters.keyHarmonics}
            setKeyHarmonics={filters.setKeyHarmonics}
            selectedGenres={filters.selectedGenres}
            toggleGenre={filters.toggleGenre}
            genres={genres}
            genreCounts={genreCounts}
            minRating={filters.minRating}
            setMinRating={filters.setMinRating}
            clearFilters={handleClearAll}
            hasActiveFilters={filters.hasActiveFilters}
            filteredCount={filters.filtered.length}
            totalCount={tracks.length}
          />

          <TrackTable
            tracks={filters.filtered}
            sortCol={filters.sortCol}
            sortDir={filters.sortDir}
            onSort={filters.handleSort}
          />
        </main>
      </div>
    </div>
  );
}
