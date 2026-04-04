import { useState } from 'react';
import { Disc3 } from 'lucide-react';
import { useLibrary } from './hooks/useLibrary.js';
import { useFilters } from './hooks/useFilters.js';
import { PlaylistSidebar } from './components/PlaylistSidebar.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { TrackTable } from './components/TrackTable.jsx';

export default function App() {
  const { tracks, genres, playlists, loading, error } = useLibrary();
  const filters = useFilters(tracks);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

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
          <p className="text-gray-500 text-sm">Loading library…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0d12]">
        <div className="text-center space-y-2">
          <p className="text-red-400 font-medium">Failed to load library</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <p className="text-gray-700 text-xs">Is the server running? <code className="bg-white/5 px-1 rounded">cd server && npm start</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0d0d12] overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-3 bg-[#13131a] border-b border-white/5 shrink-0">
        <Disc3 size={20} className="text-violet-500 shrink-0" />
        <h1 className="text-sm font-semibold text-gray-200 tracking-wide">Rekordbox Browser</h1>
        {selectedPlaylist && (
          <span className="text-sm text-gray-500">
            / <span className="text-violet-400">{selectedPlaylist.name}</span>
          </span>
        )}
        <div className="ml-auto text-xs text-gray-700 font-mono">{tracks.length.toLocaleString()} tracks total</div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <PlaylistSidebar
          playlists={playlists}
          onSelect={handlePlaylistSelect}
          selectedPlaylist={selectedPlaylist}
          onClearPlaylist={handleClearPlaylist}
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
            selectedKeys={filters.selectedKeys}
            toggleKey={filters.toggleKey}
            selectedGenres={filters.selectedGenres}
            toggleGenre={filters.toggleGenre}
            genres={genres}
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
