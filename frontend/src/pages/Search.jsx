import React, { useState } from "react";
import axios from "axios";
import ResumeCard from "../components/ResumeCard";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [askResults, setAskResults] = useState([]);
  const API = import.meta.env.VITE_API || "http://localhost:4000";

  // Search resumes
  const runSearch = async () => {
    if (!q.trim()) return alert("Please enter a search query");
    try {
      const res = await axios.get(`${API}/api/resumes?q=${encodeURIComponent(q)}&limit=10`);
      setResults(res.data.resumes || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching search results");
    }
  };

  // Ask top evidence
  const runAsk = async () => {
    if (!q.trim()) return alert("Please enter a question");
    try {
      const res = await axios.post(`${API}/api/resumes/ask`, { query: q, k: 5 });
      setAskResults(res.data?.results || []);
    } catch (err) {
      console.error(err);
      alert("Error running Ask query");
    }
  };

  return (
    <div
      className="page container"
      style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Search Resumes / Ask</h2>

      {/* Search / Ask bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter search query or question..."
          style={{
            flex: 1,
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={runSearch}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        <button
          onClick={runAsk}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#28a745",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>

      {/* Results */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Search Results */}
        <div style={{ flex: "1 1 450px", minWidth: "300px" }}>
          <h3 style={{ marginBottom: "15px" }}>Search Results</h3>
          {results.length === 0 ? (
            <p style={{ color: "#555" }}>No results yet.</p>
          ) : (
            results.map((r) => <ResumeCard key={r.id || r._id} r={r} />)
          )}
        </div>

        {/* Ask Results */}
        <div style={{ flex: "1 1 450px", minWidth: "300px" }}>
          <h3 style={{ marginBottom: "15px" }}>Ask Results</h3>
          {askResults.length === 0 ? (
            <p style={{ color: "#555" }}>No ask results yet.</p>
          ) : (
            askResults.map((res, idx) => (
              <div
                key={idx}
                style={{
                  background: "#060000ff",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  borderLeft: "4px solid #28a745",
                }}
              >
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>Resume:</strong> {res.originalName || res.resumeId || "Unknown"}
                </p>
                {res.evidence?.length > 0 && (
                  <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    {res.evidence.map((ev, i) => (
                      <li key={i} style={{ marginBottom: "4px" }}>
                        {ev}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
