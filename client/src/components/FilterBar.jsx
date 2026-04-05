import { ChevronDown, Search, X, Star, Music2 } from 'lucide-react';
import { getHarmonicKeys } from '../hooks/useFilters.js';

const CAMELOT_ORDER = [
  '1A','2A','3A','4A','5A','6A','7A','8A','9A','10A','11A','12A',
  '1B','2B','3B','4B','5B','6B','7B','8B','9B','10B','11B','12B',
];

// Reusable styled native select
function StyledSelect({ value, onChange, children, placeholder, disabled }) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="appearance-none bg-[#1a1a24] border border-white/10 rounded-lg pl-3 pr-7 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-violet-500/50 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full"
      >
        {children}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          onClick={() => onChange(value === n ? 0 : n)}
          className="transition-fast hover:scale-110 p-0.5"
          title={`Min ${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={14}
            className={n <= value ? 'text-amber-400' : 'text-gray-600'}
            fill={n <= value ? '#fbbf24' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}

export function FilterBar({
  search, setSearch,
  bpmMin, setBpmMin, bpmMax, setBpmMax,
  keyRoot, setKeyRoot, keyHarmonics, setKeyHarmonics,
  selectedGenre, setSelectedGenre,
  genres, genreCounts,
  minRating, setMinRating,
  clearFilters, hasActiveFilters,
  filteredCount, totalCount,
}) {
  const harmonicKeys = getHarmonicKeys(keyRoot, keyHarmonics);

  return (
    <div className="bg-[#13131a] border-b border-white/5 px-3 py-2 shrink-0">
      {/* All controls in one wrapping row */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search — grows to fill space on desktop, full width first on mobile */}
        <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[160px] sm:max-w-xs order-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-7 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* BPM range */}
        <div className="flex items-center gap-1 shrink-0 order-2">
          <span className="text-xs text-gray-500 font-medium">BPM</span>
          <input
            type="number"
            placeholder="min"
            value={bpmMin}
            onChange={e => setBpmMin(e.target.value)}
            className="w-14 bg-[#1a1a24] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors text-center"
          />
          <span className="text-gray-600 text-xs">–</span>
          <input
            type="number"
            placeholder="max"
            value={bpmMax}
            onChange={e => setBpmMax(e.target.value)}
            className="w-14 bg-[#1a1a24] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors text-center"
          />
        </div>

        {/* Key — select + harmonics toggle */}
        <div className="flex items-center gap-1 shrink-0 order-3">
          <StyledSelect
            value={keyRoot || ''}
            onChange={e => { setKeyRoot(e.target.value || null); if (!e.target.value) setKeyHarmonics(false); }}
          >
            <option value="">Key</option>
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
          </StyledSelect>

          {/* Harmonics toggle — only when a key is selected */}
          {keyRoot && (
            <button
              onClick={() => setKeyHarmonics(h => !h)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs border transition-colors shrink-0 ${
                keyHarmonics
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
              }`}
              title={`Harmonics: include ${[...harmonicKeys].filter(k => k !== keyRoot).join(', ')}`}
            >
              <Music2 size={11} />
              <span className="hidden sm:inline">±</span>
            </button>
          )}
        </div>

        {/* Genre — single select */}
        <div className="shrink-0 order-4 min-w-[130px]">
          <StyledSelect
            value={selectedGenre || ''}
            onChange={e => setSelectedGenre(e.target.value || null)}
          >
            <option value="">Genre</option>
            {genres.map(g => (
              <option key={g} value={g}>{g} ({genreCounts[g] ?? 0})</option>
            ))}
          </StyledSelect>
        </div>

        {/* Rating stars */}
        <div className="flex items-center gap-1.5 shrink-0 order-5">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Min</span>
          <StarRating value={minRating} onChange={setMinRating} />
        </div>

        {/* Track count + clear — pushed right on desktop */}
        <div className="flex items-center gap-2 ml-auto order-6 shrink-0">
          <span className="text-sm text-gray-400 tabular-nums whitespace-nowrap">
            <span className="text-gray-100 font-medium">{filteredCount.toLocaleString()}</span>
            {filteredCount !== totalCount && (
              <span className="text-gray-600"> / {totalCount.toLocaleString()}</span>
            )}
            <span className="text-gray-600 hidden sm:inline"> tracks</span>
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 border border-violet-500/30 rounded-lg px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              <X size={11} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
