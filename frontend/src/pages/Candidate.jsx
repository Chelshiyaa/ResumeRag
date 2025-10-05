import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Candidate() {
  const { id } = useParams(); 
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API; // now uses the live backend

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) {
        setError("Resume ID is missing");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API}/api/resumes/${id}`, {
          headers: { "x-role": role },
        });
        setResume(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message);
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, role]);

  return (
    <div className="page">
      <h2>Candidate Details</h2>
      <div className="role-switch">
        <label>Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Viewer (PII redacted)</option>
          <option value="recruiter">Recruiter (PII shown)</option>
        </select>
      </div>

      <div className="candidate">
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {resume && !error && (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(resume, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
