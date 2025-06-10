import React from 'react';
import "./i18n";
import GamePage from "./pages/Gamepage";
import Frontpage from "./pages/Frontpage";
import DevPage from "./pages/DevPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from "./pages/Registration";
import "./App.css"
import SettingsPage from "./pages/SettingsPage";
import TestPage from "./pages/TestPage";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/dev" element={<DevPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Router>
  );
}

export default App;