import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AppLayout from "./layouts/AppLayout";
import Reader from "./pages/Reader";
import Testing from "./pages/Testing";
import Creative from "./pages/Creative";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />

        {/* App dashboard with shared layout */}
        <Route path="/app" element={<AppLayout />}>
          {/* Default page at /app */}
          <Route index element={<Reader />} />
          {/* Nested pages */}
          <Route path="testing" element={<Testing />} />
          <Route path="creative" element={<Creative />} />
        </Route>

        {/* Optional: catch‑all to Landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

