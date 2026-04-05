import { Search, X, Star, Music2 } from 'lucide-react';
import { getHarmonicKeys } from '../hooks/useFilters.js';

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
            className={n <= value ? 'text-amber-400' : 'text-gray-600'}
            fill={n <= value ? '#fbbf24' : 'none'}
          />
        </button>
      ))}
      {value > 0 && <span className="text-xs text-gray-500 ml-1">min</span>}
    </div>
  );
}

function KeyFilter({ keyRoot, setKeyRoot, keyHarmonics, setKeyHarmonics }) {
  const harmonicSet = getHarmonicKeys(keyRoot, keyHarmonics);

  return (
    <div className="flex items-start gap-3 flex-wrap">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-2 shrink-0">Key</span>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Root key select */}
        <select
          value={keyRoot || ''}
          onChange={e => { setKeyRoot(e.target.value || null); }}
          className="bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-violet-500/60 transition-fast cursor-pointer appearance-none pr-7 min-w-[110px]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
        >
          <option value="">Any key</option>
          <optgroup label="Minor (A)">
            {CAMELOT_ORDER.filter(k => k.endsWith('A')).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </optgroup>
          <optgroup label="Major (B)">
            {CAMELOT_ORDER.filter(k => k.endsWith('B')).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </optgroup>
        </select>

        {/* Harmonics toggle — only shown when a key is selected */}
        {keyRoot && (
          <button
            onClick={() => setKeyHarmonics(h => !h)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-fast ${
              keyHarmonics
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
            }`}
            title="Include harmonically compatible keys (±1 on wheel + relative major/minor)"
          >
            <Music2 size={12} />
            Harmonics
          </button>
        )}

        {/* Show active key chips */}
        {harmonicSet.size > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {[...harmonicSet].sort((a, b) => CAMELOT_ORDER.indexOf(a) - CAMELOT_ORDER.indexOf(b)).map(k => {
              const isRoot = k === keyRoot;
              const isMinor = k.endsWith('A');
              return (
                <span
                  key={k}
                  className={`font-mono text-xs px-1.5 py-0.5 rounded border ${
                    isRoot
                      ? isMinor
                        ? 'bg-teal-500/25 border-teal-500/50 text-teal-200'
                        : 'bg-violet-500/25 border-violet-500/50 text-violet-200'
                      : isMinor
                        ? 'bg-teal-500/10 border-teal-500/25 text-teal-400'
                        : 'bg-violet-500/10 border-violet-500/25 text-violet-400'
                  }`}
                >
                  {k}
                </span>
              );
            })}
          </div>
        )}

        {/* Clear key */}
        {keyRoot && (
          <button
            onClick={() => { setKeyRoot(null); setKeyHarmonics(false); }}
            className="text-gray-500 hover:text-gray-300 transition-fast"
            title="Clear key filter"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function GenreFilter({ genres, genreCounts, selectedGenres, toggleGenre }) {
  if (!genres.length) return null;

  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1.5 shrink-0">Genre</span>

      <div className="flex-1 max-w-xs">
        <div className="border border-white/8 rounded-lg overflow-hidden bg-[#1a1a24]">
          <div className="overflow-y-auto" style={{ maxHeight: '9rem' }}>
            {genres.map(g => {
              const active = selectedGenres.has(g);
              const count = genreCounts[g] || 0;
              return (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm text-left transition-fast border-b border-white/4 last:border-0 ${
                    active
                      ? 'bg-pink-500/15 text-pink-200'
                      : 'text-gray-300 hover:bg-white/5 hover:text-gray-100'
                  }`}
                >
                  <span className="truncate">{g}</span>
                  <span className={`ml-3 text-xs tabular-nums shrink-0 ${active ? 'text-pink-400' : 'text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {selectedGenres.size > 0 && (
          <div className="mt-1 flex items-center gap-1 flex-wrap">
            {[...selectedGenres].map(g => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className="flex items-center gap-1 text-xs bg-pink-500/15 border border-pink-500/30 text-pink-300 rounded px-1.5 py-0.5 hover:bg-pink-500/25 transition-fast"
              >
                {g} <X size={10} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterBar({
  search, setSearch,
  bpmMin, setBpmMin, bpmMax, setBpmMax,
  keyRoot, setKeyRoot, keyHarmonics, setKeyHarmonics,
  selectedGenres, toggleGenre,
  genres, genreCounts,
  minRating, setMinRating,
  clearFilters, hasActiveFilters,
  filteredCount, totalCount,
}) {
  return (
    <div className="bg-[#13131a] border-b border-white/5 px-4 py-3 space-y-3 shrink-0">

      {/* Row 1: search + track count + clear */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search artist, title, album, genre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-fast"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="text-sm text-gray-400 tabular-nums whitespace-nowrap">
          <span className="text-gray-100 font-medium">{filteredCount.toLocaleString()}</span>
          {filteredCount !== totalCount && <span className="text-gray-500"> / {totalCount.toLocaleString()}</span>}
          <span className="text-gray-500"> tracks</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 border border-violet-500/30 rounded-lg px-2.5 py-1.5 transition-fast whitespace-nowrap"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* Row 2: BPM + Rating */}
      <div className="flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">BPM</span>
          <input
            type="number"
            placeholder="Min"
            value={bpmMin}
            onChange={e => setBpmMin(e.target.value)}
            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-fast"
          />
          <span className="text-gray-500">–</span>
          <input
            type="number"
            placeholder="Max"
            value={bpmMax}
            onChange={e => setBpmMax(e.target.value)}
            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-fast"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</span>
          <StarRating value={minRating} onChange={setMinRating} />
        </div>
      </div>

      {/* Row 3: Key */}
      <KeyFilter
        keyRoot={keyRoot}
        setKeyRoot={setKeyRoot}
        keyHarmonics={keyHarmonics}
        setKeyHarmonics={setKeyHarmonics}
      />

      {/* Row 4: Genre */}
      <GenreFilter
        genres={genres}
        genreCounts={genreCounts}
        selectedGenres={selectedGenres}
        toggleGenre={toggleGenre}
      />
    </div>
  );
}
