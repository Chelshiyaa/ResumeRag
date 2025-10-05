import React, { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_API || "http://localhost:4000";

  const handleFiles = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadFiles = async () => {
    if (!files.length) {
      setMessage("⚠️ Please select at least one resume or ZIP file.");
      return;
    }

    try {
      const fd = new FormData();
      files.forEach((file) => fd.append("files", file));
      const res = await axios.post(`${API}/api/resumes`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
       if (res.data.files && res.data.files.length) {
      const uploadedNames = res.data.files.map((f) => f.originalName || f.name).join(", ");
      setMessage(`✅ Uploaded: ${uploadedNames}`);
    } else if (res.data.message) {
      setMessage(`✅ ${res.data.message}`);
    } else {
      setMessage("✅ Files uploaded successfully!");
    }
      // setMessage(`✅ ${res.data.message}`);
      setFiles([]); // reset after successful upload
      
    } catch (err) {
      console.error(err);
      setMessage(`❌ Upload error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="page container" style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Upload Resumés</h2>

      <div
        className="upload-grid"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          background: "#f7f7f7",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="upload-box"
          style={{
            border: "2px dashed #ccc",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.3s",
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleFiles}
            style={{ display: "none" }}
          />
          <p style={{ margin: "0", fontWeight: "500" }}>
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "Click or drag files here to upload"}
          </p>
          <p className="muted" style={{ fontSize: "0.9rem", color: "#666", marginTop: "8px" }}>
            Supported: PDF, DOCX, or ZIP containing multiple resumés
          </p>
        </div>

        {files.length > 0 && (
          <div
            className="file-preview"
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "10px 15px",
              maxHeight: "150px",
              overflowY: "auto",
              border: "1px solid #ddd",
            }}
          >
            <strong>Selected Files:</strong>
            <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="upload-actions" style={{ textAlign: "center" }}>
          <button
            className="btn primary"
            onClick={uploadFiles}
            style={{
              padding: "12px 25px",
              borderRadius: "8px",
              background: "#007bff",
              color: "#fff",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.background = "#007bff")}
          >
            Upload
          </button>

          {message && (
            <div
              className="message"
              style={{
                marginTop: "15px",
                padding: "10px",
                borderRadius: "6px",
                background: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
                color: message.startsWith("✅") ? "#155724" : "#721c24",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
