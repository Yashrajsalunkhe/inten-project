import React from "react";

function ChatHistory({ history, activeHistory, onSelect, onRename, onDelete, showOptions, setShowOptions }) {
  return (
    <div className="history-section flex flex-col gap-2 mt-2">
      <h2 className="text-lg font-semibold text-blue-700 mb-2">History</h2>
      {history.length === 0 && <div className="history-empty text-gray-400 italic">No chats yet</div>}
      {history.map((h, i) => (
        <div
          key={i}
          className={`history-item flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition border border-transparent hover:border-blue-200 ${activeHistory === i ? 'bg-blue-100 border-blue-400' : 'bg-white'}`}
          onClick={() => onSelect(i)}
          title={h.title}
          style={{ position: 'relative' }}
        >
          <span className="history-title truncate max-w-[160px] text-blue-900 font-medium">{h.title}</span>
          <button
            className="history-action-btn three-dot text-xl px-2 py-1 rounded hover:bg-blue-50 focus:outline-none"
            title="Options"
            onClick={e => {
              e.stopPropagation();
              setShowOptions(showOptions === i ? null : i);
            }}
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={showOptions === i}
          >⋮</button>
          {showOptions === i && (
            <div
              className="history-options-menu show flex flex-col absolute right-0 top-10 bg-white border border-blue-200 rounded-lg shadow-lg z-50 min-w-[120px]"
              onClick={e => e.stopPropagation()}
              tabIndex={-1}
            >
              <button className="history-options-item px-4 py-2 text-left hover:bg-blue-50" onClick={e => { e.stopPropagation(); onRename(i); setShowOptions(null); }}>Rename</button>
              <button className="history-options-item delete px-4 py-2 text-left text-red-600 hover:bg-red-50" onClick={e => { e.stopPropagation(); onDelete(i); setShowOptions(null); }}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;
