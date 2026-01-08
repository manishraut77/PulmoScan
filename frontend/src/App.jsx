import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LandingPage from "./pages/LandingPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import AboutAI from "./pages/AboutAI";
import PastResultsPage from "./pages/PastResultsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
         
          <Route path="/past-results" element={<PastResultsPage />} />
           <Route path="/about-ai" element={<AboutAI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
