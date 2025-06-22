// import { useState } from 'react'

import "./App.css";
import { Header } from "./components/Header";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage.jsx";
import { GeneratorPage } from "./pages/GeneratorPage/GeneratorPage.jsx";
import { HistoryPage } from "./pages/HistoryPage/HistoryPage.jsx";

export const App = () => {
  return (
    <Router>

      <div className="app-container">
        <Header />
        {/* <main className="app-content"> */}
        <main>
          <Routes>
            <Route path="/" element={<AnalyticsPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
