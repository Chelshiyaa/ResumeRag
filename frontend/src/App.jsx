import React from 'react'
import Header from './components/Header'

export default function App(){
  return (
    <div className="app">
      <Header />
      <main className="container">
        <section className="hero">
          <div className="hero-left">
            <h1>ResumeRAG — Resume Search & Job Match</h1>
            <p>Upload resumés, run matches, & get snippet evidence. Built with MERN.</p>
          </div>
          <img src="/src/assets/hero.jpg" alt="hero" className="hero-img"/>
        </section>
      </main>
    </div>
  )
}
