import { useState } from 'react';
import { ChevronRight, ChevronDown, ListMusic, Folder, X, ChevronLeft } from 'lucide-react';

function PlaylistNode({ node, onSelect, selectedName, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-1.5 py-1.5 text-left rounded hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-gray-100"
          style={{ paddingLeft: `${10 + depth * 14}px`, paddingRight: '8px' }}
        >
          {open
            ? <ChevronDown size={12} className="shrink-0 text-gray-500" />
            : <ChevronRight size={12} className="shrink-0 text-gray-500" />}
          <Folder size={12} className="shrink-0 text-violet-400" />
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
      className={`w-full flex items-center gap-1.5 py-1.5 text-left rounded transition-colors text-sm ${
        isSelected
          ? 'bg-violet-600/20 text-violet-200'
          : 'text-gray-300 hover:text-gray-100 hover:bg-white/5'
      }`}
      style={{ paddingLeft: `${10 + depth * 14}px`, paddingRight: '8px' }}
    >
      <ListMusic size={12} className={`shrink-0 ${isSelected ? 'text-violet-400' : 'text-gray-500'}`} />
      <span className="truncate">{node.name}</span>
      <span className={`ml-auto text-xs tabular-nums shrink-0 ${isSelected ? 'text-violet-400' : 'text-gray-500'}`}>
        {node.trackIds.length}
      </span>
    </button>
  );
}

export function PlaylistSidebar({
  playlists, onSelect, selectedPlaylist, onClearPlaylist,
  isOpen, onClose,                   // mobile overlay state
  desktopCollapsed, onDesktopToggle, // desktop collapse state
}) {
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Playlists</h2>
        <div className="flex items-center gap-1">
          {/* Collapse button — desktop only */}
          <button
            onClick={onDesktopToggle}
            className="hidden md:flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={14} />
          </button>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-0.5">
        <button
          onClick={() => { onClearPlaylist(); onClose?.(); }}
          className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left rounded transition-colors text-sm ${
            !selectedPlaylist
              ? 'bg-violet-600/20 text-violet-200'
              : 'text-gray-300 hover:text-gray-100 hover:bg-white/5'
          }`}
        >
          <ListMusic size={12} className={`shrink-0 ${!selectedPlaylist ? 'text-violet-400' : 'text-gray-500'}`} />
          <span>All Tracks</span>
        </button>

        {playlists.map((node, i) => (
          <PlaylistNode
            key={i}
            node={node}
            onSelect={(n) => { onSelect(n); onClose?.(); }}
            selectedName={selectedPlaylist?.name}
            depth={0}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          // Base + mobile: fixed slide-in drawer
          'fixed inset-y-0 left-0 z-50 w-72 bg-[#13131a] border-r border-white/5',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop overrides
          desktopCollapsed
            ? 'md:hidden'
            : 'md:static md:w-52 md:translate-x-0 md:z-auto md:shrink-0 md:flex md:flex-col md:transition-none',
        ].join(' ')}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
