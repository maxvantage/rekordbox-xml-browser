import { useState } from 'react';
import { ChevronRight, ChevronDown, ListMusic, Folder } from 'lucide-react';

function PlaylistNode({ node, onSelect, selectedName, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 text-left rounded hover:bg-white/5 transition-fast text-sm text-gray-400 hover:text-gray-200"
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          {open
            ? <ChevronDown size={13} className="shrink-0 opacity-60" />
            : <ChevronRight size={13} className="shrink-0 opacity-60" />}
          <Folder size={13} className="shrink-0 text-accent-purple opacity-70" />
          <span className="truncate font-medium">{node.name}</span>
        </button>
        {open && (
          <div>
            {node.children.map((child, i) => (
              <PlaylistNode
                key={i}
                node={child}
                onSelect={onSelect}
                selectedName={selectedName}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = selectedName === node.name;
  return (
    <button
      onClick={() => onSelect(node)}
      className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-left rounded transition-fast text-sm ${
        isSelected
          ? 'bg-violet-600/20 text-violet-300'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
      }`}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
    >
      <ListMusic size={13} className={`shrink-0 ${isSelected ? 'text-violet-400' : 'opacity-50'}`} />
      <span className="truncate">{node.name}</span>
      <span className={`ml-auto text-xs tabular-nums shrink-0 ${isSelected ? 'text-violet-400' : 'text-gray-600'}`}>
        {node.trackIds.length}
      </span>
    </button>
  );
}

export function PlaylistSidebar({ playlists, onSelect, selectedPlaylist, onClearPlaylist }) {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#13131a] border-r border-white/5 overflow-y-auto">
      <div className="px-3 py-3 border-b border-white/5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Playlists</h2>
      </div>

      <div className="flex-1 px-1 py-2 space-y-0.5">
        <button
          onClick={onClearPlaylist}
          className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-left rounded transition-fast text-sm ${
            !selectedPlaylist
              ? 'bg-violet-600/20 text-violet-300'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <ListMusic size={13} className={`shrink-0 ${!selectedPlaylist ? 'text-violet-400' : 'opacity-50'}`} />
          <span>All Tracks</span>
        </button>

        {playlists.map((node, i) => (
          <PlaylistNode
            key={i}
            node={node}
            onSelect={onSelect}
            selectedName={selectedPlaylist?.name}
            depth={0}
          />
        ))}
      </div>
    </aside>
  );
}
