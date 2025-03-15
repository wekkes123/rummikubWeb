import React from 'react';
import "./i18n";
import GamePage from "./Pages/Gamepage";
import Frontpage from "./Pages/Frontpage";
import TestPage from "./Pages/TestPage";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Registration from "./Pages/Registration";

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Frontpage />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/game" element={<GamePage />} />
                </Routes>
        </Router>
    );
}

export default App;