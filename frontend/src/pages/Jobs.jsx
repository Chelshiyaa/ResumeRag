import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:4000";

export default function Jobs() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [jobs, setJobs] = useState([]);
  const [matchesMap, setMatchesMap] = useState({}); // store matches per job

  const handleCreateJob = async () => {
    try {
      const { data } = await axios.post(`${API}/api/jobs`, {
        title,
        description,
        requirements: requirements.split(",").map((r) => r.trim()),
      });

      // Make sure we store the full job object in state
      setJobs((prev) => [...prev, data]);
      setTitle("");
      setDescription("");
      setRequirements("");
      alert("✅ Job created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating job");
    }
  };

  const handleMatch = async (jobId) => {
    if (!jobId) return alert("Job ID missing!");
    try {
      const { data } = await axios.post(`${API}/api/jobs/${jobId}/match`, { top_n: 3 });
      // store matches along with the job info
      setMatchesMap((prev) => ({
        ...prev,
        [jobId]: {
          jobTitle: jobs.find((j) => j._id === jobId)?.title || "",
          jobDescription: jobs.find((j) => j._id === jobId)?.description || "",
          matches: data.matches || [],
        },
      }));
      console.log("Match result:", data);
    } catch (err) {
      console.error(err);
      alert("Error matching candidates");
    }
  };

  return (
    <div className="page container">
      <h2>Jobs</h2>

      {/* ===== CREATE JOB FORM ===== */}
      <div className="job-form" style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Requirements (comma separated)"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <button className="btn primary" onClick={handleCreateJob}>
          Create Job
        </button>
      </div>

      {/* ===== CREATED JOBS ===== */}
      <h3>Created Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs created yet.</p>
      ) : (
        jobs.map((job) => {
          const jobKey = job._id || job.id;
          const matchData = matchesMap[jobKey] || {};
          const matches = matchData.matches || [];
          return (
            <div key={jobKey} className="job-card" style={{ marginBottom: "20px" }}>
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <button className="btn" onClick={() => handleMatch(jobKey)}>
                Match Candidates
              </button>

              {/* ===== MATCHES ===== */}
              {matches.length > 0 && (
                <div className="matches" style={{ marginTop: "12px", paddingLeft: "10px" }}>
                  <h5>Top Matches</h5>
                  {/* Show Job Title & Description at the top */}
                  <div style={{ marginBottom: "10px", padding: "6px 8px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <strong>Job Title:</strong> {matchData.jobTitle} <br />
                    <strong>Description:</strong> {matchData.jobDescription}
                  </div>
                  {matches.map((m, i) => (
                    <div
                      key={i}
                      className="match-card"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>{m.originalName}</strong>
                      <p>Score: {(m.score * 100).toFixed(2)}%</p>
                      <p>
                        <b>Missing:</b>{" "}
                        {m.missingRequirements?.length ? m.missingRequirements.join(", ") : "None"}
                      </p>
                      {m.evidence?.length > 0 && (
                        <p>
                          <b>Evidence:</b> {m.evidence.join("; ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
