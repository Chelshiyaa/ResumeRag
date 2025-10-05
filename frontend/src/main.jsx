import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Jobs from "./pages/Jobs";
import Candidate from "./pages/Candidate";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidates/:id" element={<Candidate />} />
        <Route path="/candidate/:id" element={<Candidate />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
