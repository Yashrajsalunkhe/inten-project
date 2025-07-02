import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatHistory from "./ChatHistory";

function ChatBoxWithUpload() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Upload your Excel/CSV file and ask me anything about your data." }
  ]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState([]); // [{title: string, messages: [...]}, ...]
  const [activeHistory, setActiveHistory] = useState(null); // index of selected history
  const [showOptions, setShowOptions] = useState(null);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({ top: chatLogRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Save to history when a new chat starts (first user message after upload)
  useEffect(() => {
    if (messages.length === 2 && messages[1].sender === "user") {
      // New chat session
      setHistory(prev => [
        { title: messages[1].text.slice(0, 30) + (messages[1].text.length > 30 ? '...' : ''), messages: [messages[0], messages[1]] },
        ...prev
      ]);
      setActiveHistory(0);
    } else if (activeHistory !== null && messages.length > 2) {
      // Update current history
      setHistory(prev => prev.map((h, i) => i === activeHistory ? { ...h, messages: messages } : h));
    }
  }, [messages]);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (!selectedFile) return;
    setUploading(true);
    setUploadStatus("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios.post("/upload", formData);
      setUploadStatus("✅ File uploaded successfully");
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "File uploaded! Now you can ask questions about your data." }
      ]);
    } catch (error) {
      setUploadStatus("❌ Upload failed");
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Upload failed. Please try again." }
      ]);
    }
    setUploading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await axios.post("/chat", { message: input });
      const botMsg = { sender: "bot", text: res.data.reply };
      setTimeout(() => {
        setMessages((prev) => {
          // If a chart is present, add it as a separate message
          if (res.data.chart) {
            return [...prev, botMsg, { sender: "bot", chart: res.data.chart }];
          }
          return [...prev, botMsg];
        });
      }, 400);
    } catch (err) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: "Error contacting backend." }]);
      }, 400);
    }
  };

  // Select a chat history
  const handleSelectHistory = (idx) => {
    setActiveHistory(idx);
    setMessages(history[idx].messages);
  };

  // Start a new chat
  const handleNewChat = () => {
    setMessages([{ sender: "bot", text: "Hi! Upload your Excel/CSV file and ask me anything about your data." }]);
    setActiveHistory(null);
  };

  const handleDeleteHistory = (idx) => {
    setHistory(prev => prev.filter((_, i) => i !== idx));
    if (activeHistory === idx) {
      setMessages([{ sender: "bot", text: "Hi! Upload your Excel/CSV file and ask me anything about your data." }]);
      setActiveHistory(null);
    } else if (activeHistory > idx) {
      setActiveHistory(activeHistory - 1);
    }
  };

  const handleRenameHistory = (idx) => {
    const newTitle = prompt("Enter new title for this chat:", history[idx].title);
    if (newTitle && newTitle.trim()) {
      setHistory(prev => prev.map((h, i) => i === idx ? { ...h, title: newTitle.trim() } : h));
    }
  };

  useEffect(() => {
    const closeMenu = (e) => {
      // Only close if click is outside any .history-options-menu
      if (!e.target.closest('.history-options-menu') && !e.target.closest('.three-dot')) {
        setShowOptions(null);
      }
    };
    if (showOptions !== null) {
      window.addEventListener('mousedown', closeMenu);
      return () => window.removeEventListener('mousedown', closeMenu);
    }
  }, [showOptions]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-[320px] min-h-screen bg-white border-r border-blue-100 shadow-lg flex flex-col px-6 py-10 z-10">
        <h1 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-wide text-center">Gemini Chatbot</h1>
        <button
          className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-lg text-base font-semibold py-2 px-4 mb-6 shadow hover:from-blue-800 transition w-full"
          onClick={handleNewChat}
        >
          + New Chat
        </button>
        <ChatHistory
          history={history}
          activeHistory={activeHistory}
          onSelect={handleSelectHistory}
          onRename={handleRenameHistory}
          onDelete={handleDeleteHistory}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
      </aside>
      {/* Chat Section */}
      <main className="flex-1 flex flex-col items-center justify-end relative bg-transparent">
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-end pb-8 pt-8 relative mx-auto">
          <div ref={chatLogRef} className="flex flex-col gap-5 w-full h-full overflow-y-auto px-2" style={{scrollBehavior:'smooth'}}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-4 ${msg.sender === "user" ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
                style={{ animation: 'messageIn 0.5s', animationDelay: `${i * 0.08 + 0.1}s` }}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold border-2 shadow ${msg.sender === "user" ? "bg-blue-100 text-blue-700 border-white" : "bg-blue-50 text-blue-700 border-white"}`}>
                  {msg.sender === "user" ? "🧑" : "🤖"}
                </div>
                <div className={`rounded-2xl px-6 py-4 text-base shadow border ${msg.sender === "user" ? "bg-blue-700 text-white border-blue-700 ml-20" : "bg-slate-50 text-gray-900 border-blue-100 mr-20"}`} style={{maxWidth:'70%'}}>
                  {msg.text}
                  {msg.chart && (
                    <img src={msg.chart} alt="Chart" className="mt-2 rounded-lg border border-blue-200 shadow max-w-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Input Bar - sticky at bottom of chat section */}
          <div className="sticky left-0 right-0 bottom-0 mx-auto w-full max-w-lg z-50 flex items-center bg-white rounded-2xl shadow-lg px-4 py-3 gap-3 border border-blue-100 mt-6" style={{marginTop: 'auto'}}>
            <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center rounded-lg p-2 hover:bg-blue-50 transition" title="Attach file">
              <svg width="24" height="24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.19 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.49"/></svg>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.csv"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={input}
              placeholder="Type your question..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              disabled={uploading}
              autoFocus
              className="flex-1 min-w-[120px] max-w-[400px] px-5 py-3 rounded-lg border border-blue-100 bg-white text-gray-900 text-base shadow focus:border-blue-700 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={uploading || !input.trim()}
              className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-lg px-6 py-3 font-semibold shadow hover:from-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          {uploadStatus && <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-blue-700 font-medium text-base">{uploadStatus}</div>}
        </div>
      </main>
    </div>
  );
}

export default ChatBoxWithUpload;
