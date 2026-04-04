import { useRef, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronUp, ChevronDown, Star, Wifi, ChevronRight } from 'lucide-react';
import { CueList } from './CueList.jsx';

const COLUMNS = [
  { key: 'artist',    label: 'Artist',   width: 180, sortable: true },
  { key: 'name',      label: 'Title',    width: 220, sortable: true },
  { key: 'album',     label: 'Album',    width: 160, sortable: true },
  { key: 'bpm',       label: 'BPM',      width: 72,  sortable: true, align: 'right' },
  { key: 'key',       label: 'Key',      width: 56,  sortable: true, align: 'center' },
  { key: 'genre',     label: 'Genre',    width: 120, sortable: true },
  { key: 'rating',    label: 'Stars',    width: 88,  sortable: true, align: 'center' },
  { key: 'duration',  label: 'Time',     width: 60,  sortable: false, align: 'right' },
  { key: 'dateAdded', label: 'Added',    width: 96,  sortable: true },
  { key: 'playCount', label: 'Plays',    width: 56,  sortable: true, align: 'right' },
];

function StarDisplay({ rating }) {
  return (
    <div className="flex justify-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          size={11}
          className={n <= rating ? 'text-amber-400' : 'text-gray-700'}
          fill={n <= rating ? '#fbbf24' : 'none'}
        />
      ))}
    </div>
  );
}

function KeyBadge({ keyVal }) {
  if (!keyVal) return <span className="text-gray-700">—</span>;
  const isMinor = keyVal.endsWith('A');
  return (
    <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
      isMinor
        ? 'bg-teal-500/15 text-teal-400'
        : 'bg-violet-500/15 text-violet-400'
    }`}>
      {keyVal}
    </span>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  if (col !== sortCol) return <ChevronUp size={11} className="opacity-0 group-hover:opacity-30" />;
  return sortDir === 'asc'
    ? <ChevronUp size={11} className="text-violet-400" />
    : <ChevronDown size={11} className="text-violet-400" />;
}

const ROW_HEIGHT = 40;
const EXPANDED_EXTRA = 80; // approximate extra height for cue section

export function TrackTable({ tracks, sortCol, sortDir, onSort }) {
  const parentRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  const rowVirtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(
      i => tracks[i]?.id === expandedId ? ROW_HEIGHT + EXPANDED_EXTRA : ROW_HEIGHT,
      [expandedId, tracks]
    ),
    overscan: 15,
  });

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex bg-[#13131a] border-b border-white/5 shrink-0">
        {/* expand col */}
        <div className="w-8 shrink-0" />
        {COLUMNS.map(col => (
          <div
            key={col.key}
            style={{ width: col.width, minWidth: col.width }}
            className={`flex items-center gap-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0 group ${
              col.sortable ? 'cursor-pointer hover:text-gray-300 select-none' : ''
            } ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}
            onClick={col.sortable ? () => onSort(col.key) : undefined}
          >
            {col.label}
            {col.sortable && <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />}
          </div>
        ))}
      </div>

      {/* Virtual scroll body */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(vRow => {
            const track = tracks[vRow.index];
            const isExpanded = expandedId === track.id;
            const isEven = vRow.index % 2 === 0;

            return (
              <div
                key={track.id}
                data-index={vRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: vRow.start,
                  left: 0,
                  right: 0,
                }}
              >
                {/* Main row */}
                <div
                  className={`flex items-center cursor-pointer transition-fast border-b border-white/3 ${
                    isExpanded
                      ? 'bg-violet-900/15 border-violet-500/20'
                      : isEven
                        ? 'bg-transparent hover:bg-white/3'
                        : 'bg-white/2 hover:bg-white/4'
                  }`}
                  style={{ height: ROW_HEIGHT }}
                  onClick={() => toggleExpand(track.id)}
                >
                  {/* Expand toggle */}
                  <div className="w-8 shrink-0 flex items-center justify-center">
                    <ChevronRight
                      size={12}
                      className={`text-gray-600 transition-transform duration-150 ${isExpanded ? 'rotate-90 text-violet-400' : ''}`}
                    />
                  </div>

                  {COLUMNS.map(col => (
                    <div
                      key={col.key}
                      style={{ width: col.width, minWidth: col.width }}
                      className={`px-3 py-0 shrink-0 text-sm truncate ${
                        col.align === 'right' ? 'text-right' :
                        col.align === 'center' ? 'flex justify-center' : ''
                      }`}
                    >
                      {col.key === 'artist' && (
                        <span className="text-gray-200 font-medium flex items-center gap-1.5 truncate">
                          {track.isSpotify && (
                            <Wifi size={11} className="text-green-400 shrink-0" title="Spotify import" />
                          )}
                          <span className="truncate">{track.artist || <em className="text-gray-600">Unknown</em>}</span>
                        </span>
                      )}
                      {col.key === 'name' && (
                        <span className="text-gray-300 truncate">{track.name}</span>
                      )}
                      {col.key === 'album' && (
                        <span className="text-gray-500 truncate">{track.album || '—'}</span>
                      )}
                      {col.key === 'bpm' && (
                        <span className="text-gray-400 font-mono text-xs">
                          {track.bpm ? track.bpm.toFixed(0) : '—'}
                        </span>
                      )}
                      {col.key === 'key' && <KeyBadge keyVal={track.key} />}
                      {col.key === 'genre' && (
                        <span className="text-gray-500 truncate">{track.genre || '—'}</span>
                      )}
                      {col.key === 'rating' && <StarDisplay rating={track.rating} />}
                      {col.key === 'duration' && (
                        <span className="text-gray-500 font-mono text-xs">{track.duration}</span>
                      )}
                      {col.key === 'dateAdded' && (
                        <span className="text-gray-600 text-xs">{track.dateAdded}</span>
                      )}
                      {col.key === 'playCount' && (
                        <span className={`text-xs font-mono ${track.playCount > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                          {track.playCount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Expanded cue detail */}
                {isExpanded && (
                  <div className="bg-violet-950/10 border-b border-violet-500/15 px-8 py-3">
                    <CueList track={track} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
