import React from 'react';
import "./i18n";
import Frontpage from "./Pages/Frontpage";
import TestPage from "./Pages/TestPage";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Frontpage />} />
                    <Route path="/test" element={<TestPage />} />
                </Routes>
        </Router>
    );
}

export default App;