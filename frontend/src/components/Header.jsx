import React from 'react'
import { Link } from 'react-router-dom'
export default function Header(){
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand"><Link to="/">ResumeRAG</Link></div>
        <nav>
          <Link to="/upload">Upload</Link>
          <Link to="/search">Search</Link>
          <Link to="/jobs">Jobs</Link>
        </nav>
      </div>
    </header>
  )
}
