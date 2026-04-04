import { Search, X, Star } from 'lucide-react';

// Camelot wheel order for display
const CAMELOT_ORDER = [
  '1A','2A','3A','4A','5A','6A','7A','8A','9A','10A','11A','12A',
  '1B','2B','3B','4B','5B','6B','7B','8B','9B','10B','11B','12B',
];

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          onClick={() => onChange(value === n ? 0 : n)}
          className="transition-fast hover:scale-110"
          title={`Min ${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={14}
            className={n <= value ? 'star-filled fill-amber-400' : 'star-empty'}
            fill={n <= value ? '#fbbf24' : 'none'}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-gray-500 ml-1">+</span>
      )}
    </div>
  );
}

export function FilterBar({
  search, setSearch,
  bpmMin, setBpmMin, bpmMax, setBpmMax,
  selectedKeys, toggleKey,
  selectedGenres, toggleGenre,
  genres,
  minRating, setMinRating,
  clearFilters, hasActiveFilters,
  filteredCount, totalCount,
}) {
  const sortedKeys = CAMELOT_ORDER;

  return (
    <div className="bg-[#13131a] border-b border-white/5 px-4 py-3 space-y-3">
      {/* Row 1: search + counts */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search artist, title, album, genre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/7 transition-fast"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500 tabular-nums">
          <span className="text-gray-300 font-medium">{filteredCount.toLocaleString()}</span>
          {filteredCount !== totalCount && <span> / {totalCount.toLocaleString()}</span>}
          <span> tracks</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 border border-violet-500/30 rounded px-2 py-1 transition-fast"
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </div>

      {/* Row 2: BPM + Rating */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">BPM</span>
          <input
            type="number"
            placeholder="Min"
            value={bpmMin}
            onChange={e => setBpmMin(e.target.value)}
            className="w-16 bg-white/5 border border-white/8 rounded px-2 py-1 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-fast"
          />
          <span className="text-gray-600">–</span>
          <input
            type="number"
            placeholder="Max"
            value={bpmMax}
            onChange={e => setBpmMax(e.target.value)}
            className="w-16 bg-white/5 border border-white/8 rounded px-2 py-1 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-fast"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Rating</span>
          <StarRating value={minRating} onChange={setMinRating} />
        </div>
      </div>

      {/* Row 3: Key filter */}
      <div className="flex items-start gap-2 flex-wrap">
        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 shrink-0">Key</span>
        <div className="flex flex-wrap gap-1">
          {sortedKeys.map(key => {
            const active = selectedKeys.has(key);
            const isMinor = key.endsWith('A');
            return (
              <button
                key={key}
                onClick={() => toggleKey(key)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-fast border ${
                  active
                    ? isMinor
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                    : 'bg-white/3 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 4: Genre filter */}
      {genres.length > 0 && (
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 shrink-0">Genre</span>
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
            {genres.map(g => {
              const active = selectedGenres.has(g);
              return (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-2 py-0.5 rounded text-xs transition-fast border ${
                    active
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                      : 'bg-white/3 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
