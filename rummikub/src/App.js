import React from 'react';
import { useTranslation } from "react-i18next";
import "./i18n";
import Frontpage from "./Pages/Frontpage";
import TestPage from "./Pages/TestPage"; // Import your TestPage component
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import routing components

function App() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Frontpage />} />
                    <Route path="/test" element={<TestPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;