import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/upload", formData);
      setStatus("✅ File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto mt-10 border border-blue-100">
      <h3 className="text-xl font-bold text-blue-700 mb-4">Upload Excel / CSV File</h3>
      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-lg px-6 py-2 font-semibold shadow hover:from-blue-800 transition w-full mb-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={!file}
      >
        Upload
      </button>
      <p className="text-sm text-blue-700 mt-2">{status}</p>
    </div>
  );
}

export default FileUpload;
