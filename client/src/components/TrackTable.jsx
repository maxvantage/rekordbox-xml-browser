import { useRef, useCallback, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronUp, ChevronDown, Star } from 'lucide-react';

const DEFAULT_WIDTHS = {
  artist:    180,
  name:      220,
  album:     150,
  bpm:        68,
  key:        56,
  genre:     120,
  rating:     84,
  duration:   60,
  dateAdded:  94,
  playCount:  54,
  cueCount:   50,
  comments:  220,
};

const COLUMNS = [
  { key: 'artist',    label: 'Artist',   sortable: true },
  { key: 'name',      label: 'Title',    sortable: true },
  { key: 'album',     label: 'Album',    sortable: true },
  { key: 'bpm',       label: 'BPM',      sortable: true,  align: 'right' },
  { key: 'key',       label: 'Key',      sortable: true,  align: 'center' },
  { key: 'genre',     label: 'Genre',    sortable: true },
  { key: 'rating',    label: 'Stars',    sortable: true,  align: 'center' },
  { key: 'duration',  label: 'Time',     sortable: false, align: 'right' },
  { key: 'dateAdded', label: 'Added',    sortable: true },
  { key: 'playCount', label: 'Plays',    sortable: true,  align: 'right' },
  { key: 'cueCount',  label: 'Cues',     sortable: true,  align: 'center' },
  { key: 'comments',  label: 'Comments', sortable: false },
];

const ROW_HEIGHT = 38;
const MIN_COL_WIDTH = 36;

function StarDisplay({ rating }) {
  return (
    <div className="flex justify-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={11}
          className={n <= rating ? 'text-amber-400' : 'text-gray-700'}
          fill={n <= rating ? '#fbbf24' : 'none'}
        />
      ))}
    </div>
  );
}

function KeyBadge({ keyVal }) {
  if (!keyVal) return null;
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
  if (col !== sortCol) return <ChevronUp size={11} className="opacity-0 group-hover:opacity-30" />;
  return sortDir === 'asc'
    ? <ChevronUp size={11} className="text-violet-400" />
    : <ChevronDown size={11} className="text-violet-400" />;
}

export function TrackTable({ tracks, sortCol, sortDir, onSort }) {
  const parentRef = useRef(null);
  const [colWidths, setColWidths] = useState(DEFAULT_WIDTHS);
  const dragRef = useRef(null);

  const totalWidth = COLUMNS.reduce((sum, col) => sum + (colWidths[col.key] ?? DEFAULT_WIDTHS[col.key]), 0);

  const rowVirtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    overscan: 15,
  });

  function startResize(e, colKey) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = colWidths[colKey] ?? DEFAULT_WIDTHS[colKey];
    dragRef.current = { colKey, startX, startWidth };

    function onMove(e) {
      if (!dragRef.current) return;
      const { colKey, startX, startWidth } = dragRef.current;
      const newWidth = Math.max(MIN_COL_WIDTH, startWidth + e.clientX - startX);
      setColWidths(prev => ({ ...prev, [colKey]: newWidth }));
    }

    function onUp() {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function cellContent(col, track) {
    const w = colWidths[col.key] ?? DEFAULT_WIDTHS[col.key];
    switch (col.key) {
      case 'artist':
        return (
          <span className="text-gray-100 font-medium truncate block" title={track.artist}>
            {track.artist}
          </span>
        );
      case 'name':
        return (
          <span className="text-gray-200 truncate block" title={track.name}>
            {track.name}
          </span>
        );
      case 'album':
        return (
          <span className="text-gray-400 truncate block" title={track.album}>
            {track.album}
          </span>
        );
      case 'bpm':
        return (
          <span className="text-gray-300 font-mono text-xs">
            {track.bpm ? track.bpm.toFixed(0) : ''}
          </span>
        );
      case 'key':
        return <KeyBadge keyVal={track.key} />;
      case 'genre':
        return (
          <span className="text-gray-400 truncate block" title={track.genre}>
            {track.genre}
          </span>
        );
      case 'rating':
        return <StarDisplay rating={track.rating} />;
      case 'duration':
        return (
          <span className="text-gray-400 font-mono text-xs">{track.duration}</span>
        );
      case 'dateAdded':
        return (
          <span className="text-gray-400 text-xs">{track.dateAdded}</span>
        );
      case 'playCount':
        return (
          <span className={`text-xs font-mono ${track.playCount > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
            {track.playCount}
          </span>
        );
      case 'cueCount':
        return track.cueCount > 0 ? (
          <span className="text-xs font-mono text-gray-300">{track.cueCount}</span>
        ) : null;
      case 'comments':
        return track.comments ? (
          <span className="text-gray-400 text-xs truncate block" title={track.comments}>
            {track.comments}
          </span>
        ) : null;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Single scroll container for both header and rows */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div style={{ minWidth: totalWidth }}>

          {/* Sticky header — sticks vertically, scrolls horizontally with content */}
          <div className="sticky top-0 z-10 flex bg-[#13131a] border-b border-[#1e1e2a] select-none">
            {COLUMNS.map(col => {
              const w = colWidths[col.key] ?? DEFAULT_WIDTHS[col.key];
              return (
                <div
                  key={col.key}
                  style={{ width: w, minWidth: w, maxWidth: w }}
                  className={`relative flex items-center gap-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0 group ${
                    col.sortable ? 'cursor-pointer hover:text-gray-200' : ''
                  } ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                >
                  <span className="truncate">{col.label}</span>
                  {col.sortable && <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />}

                  {/* Resize handle */}
                  <div
                    className="absolute right-0 top-0 h-full w-3 cursor-col-resize flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 hover:!opacity-100"
                    onMouseDown={e => startResize(e, col.key)}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="w-px h-4 bg-white/20 hover:bg-violet-400/60 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Virtual row container */}
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
                    width: '100%',
                    height: ROW_HEIGHT,
                  }}
                  className={`flex items-center border-b border-[#1a1a26] transition-colors duration-75 ${
                    isEven
                      ? 'bg-transparent hover:bg-white/[0.035]'
                      : 'bg-white/[0.018] hover:bg-white/[0.045]'
                  }`}
                >
                  {COLUMNS.map(col => {
                    const w = colWidths[col.key] ?? DEFAULT_WIDTHS[col.key];
                    return (
                      <div
                        key={col.key}
                        style={{ width: w, minWidth: w, maxWidth: w }}
                        className={`px-3 shrink-0 overflow-hidden text-sm ${
                          col.align === 'right' ? 'text-right' :
                          col.align === 'center' ? 'flex justify-center' : ''
                        }`}
                      >
                        {cellContent(col, track)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
