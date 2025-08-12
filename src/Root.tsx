import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Hero from "./Hero";

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/app" element={<App />} />
        {/* Fallback to app on unknown routes to avoid blank page on hard refresh when deployed on static hosting */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


