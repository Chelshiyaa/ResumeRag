import React from "react";
import { Link } from "react-router-dom";

export default function ResumeCard({ r }) {
  return (
    <div className="card">
      <h3>{r.originalName || "Resume"}</h3>
      <div className="muted">ID: {r.id || r._id}</div>
      <div className="card-actions">
        {/* Always use singular 'candidate' route and ensure ID exists */}
        <Link to={`/candidate/${r.id || r._id}`} className="btn">
          View
        </Link>
      </div>
    </div>
  );
}
