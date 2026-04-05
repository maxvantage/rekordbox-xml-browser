import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronUp, ChevronDown, Star } from 'lucide-react';

const COLUMNS = [
  { key: 'artist',    label: 'Artist',    width: 180, sortable: true },
  { key: 'name',      label: 'Title',     width: 220, sortable: true },
  { key: 'album',     label: 'Album',     width: 150, sortable: true },
  { key: 'bpm',       label: 'BPM',       width: 68,  sortable: true,  align: 'right' },
  { key: 'key',       label: 'Key',       width: 56,  sortable: true,  align: 'center' },
  { key: 'genre',     label: 'Genre',     width: 120, sortable: true },
  { key: 'rating',    label: 'Stars',     width: 84,  sortable: true,  align: 'center' },
  { key: 'duration',  label: 'Time',      width: 58,  sortable: false, align: 'right' },
  { key: 'dateAdded', label: 'Added',     width: 90,  sortable: true },
  { key: 'playCount', label: 'Plays',     width: 52,  sortable: true,  align: 'right' },
  { key: 'cueCount',  label: 'Cues',      width: 50,  sortable: true,  align: 'center' },
  { key: 'comments',  label: 'Comments',  width: 200, sortable: false },
];

const ROW_HEIGHT = 40;

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
  if (!keyVal) return <span className="text-gray-600">—</span>;
  const isMinor = keyVal.endsWith('A');
  return (
    <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
      isMinor ? 'bg-teal-500/15 text-teal-300' : 'bg-violet-500/15 text-violet-300'
    }`}>
      {keyVal}
    </span>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  if (col !== sortCol) return <ChevronUp size={11} className="opacity-0 group-hover:opacity-40" />;
  return sortDir === 'asc'
    ? <ChevronUp size={11} className="text-violet-400" />
    : <ChevronDown size={11} className="text-violet-400" />;
}

export function TrackTable({ tracks, sortCol, sortDir, onSort }) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    overscan: 15,
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex bg-[#13131a] border-b border-white/5 shrink-0">
        {COLUMNS.map(col => (
          <div
            key={col.key}
            style={{ width: col.width, minWidth: col.width }}
            className={`flex items-center gap-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0 group ${
              col.sortable ? 'cursor-pointer hover:text-gray-200 select-none' : ''
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
                  height: ROW_HEIGHT,
                }}
                className={`flex items-center border-b border-white/3 transition-fast ${
                  isEven ? 'bg-transparent hover:bg-white/3' : 'bg-white/[0.02] hover:bg-white/4'
                }`}
              >
                {COLUMNS.map(col => (
                  <div
                    key={col.key}
                    style={{ width: col.width, minWidth: col.width }}
                    className={`px-3 shrink-0 text-sm ${
                      col.align === 'right' ? 'text-right' :
                      col.align === 'center' ? 'flex justify-center' : 'truncate'
                    }`}
                  >
                    {col.key === 'artist' && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        {track.isSpotify && (
                          <span className="shrink-0 text-[10px] font-semibold bg-[#1db954]/15 text-[#1db954] border border-[#1db954]/30 rounded px-1 py-px leading-tight">
                            Spotify
                          </span>
                        )}
                        <span className="text-gray-100 font-medium truncate">
                          {track.artist || <em className="text-gray-500 font-normal">Unknown</em>}
                        </span>
                      </div>
                    )}
                    {col.key === 'name' && (
                      <span className="text-gray-200 truncate block">{track.name}</span>
                    )}
                    {col.key === 'album' && (
                      <span className="text-gray-400 truncate block">{track.album || '—'}</span>
                    )}
                    {col.key === 'bpm' && (
                      <span className="text-gray-300 font-mono text-xs">
                        {track.bpm ? track.bpm.toFixed(0) : '—'}
                      </span>
                    )}
                    {col.key === 'key' && <KeyBadge keyVal={track.key} />}
                    {col.key === 'genre' && (
                      <span className="text-gray-400 truncate block">{track.genre || '—'}</span>
                    )}
                    {col.key === 'rating' && <StarDisplay rating={track.rating} />}
                    {col.key === 'duration' && (
                      <span className="text-gray-400 font-mono text-xs">{track.duration}</span>
                    )}
                    {col.key === 'dateAdded' && (
                      <span className="text-gray-400 text-xs">{track.dateAdded}</span>
                    )}
                    {col.key === 'playCount' && (
                      <span className={`text-xs font-mono ${track.playCount > 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                        {track.playCount || '—'}
                      </span>
                    )}
                    {col.key === 'cueCount' && (
                      <span className={`text-xs font-mono ${track.cueCount > 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                        {track.cueCount || '—'}
                      </span>
                    )}
                    {col.key === 'comments' && (
                      <span className="text-gray-400 text-xs truncate block">
                        {track.comments || <span className="text-gray-600">—</span>}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
