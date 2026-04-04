export function CueList({ track }) {
  const cues = track.cues || [];

  if (cues.length === 0) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-600 italic">No cue points</span>
        {track.comments && (
          <span className="text-xs text-gray-600 truncate max-w-md">{track.comments}</span>
        )}
      </div>
    );
  }

  function formatTime(secs) {
    const s = Math.floor(secs);
    const ms = Math.round((secs - s) * 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        {cues.map((cue, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-white/4 rounded px-2 py-1 text-xs"
          >
            {cue.color && (
              <span
                className="cue-dot"
                style={{ backgroundColor: cue.color }}
              />
            )}
            {cue.name && (
              <span className="text-gray-300">{cue.name}</span>
            )}
            <span className="text-gray-500 font-mono">{formatTime(cue.time)}</span>
          </div>
        ))}
      </div>
      {track.comments && (
        <div className="text-xs text-gray-600 truncate max-w-lg pt-0.5">
          {track.comments}
        </div>
      )}
    </div>
  );
}
