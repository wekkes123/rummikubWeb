import React from 'react';
import "./i18n";
import GamePage from "./Pages/Gamepage";
import Frontpage from "./Pages/Frontpage";
import DevPage from "./Pages/DevPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from "./Pages/Registration";
import "./App.css"
import SettingsPage from "./Pages/SettingsPage";


function App() {
    return (
        <Router>
            {/*<HorizontalLayout>*/}
                <Routes>
                    <Route path="/" element={<Frontpage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/dev" element={<DevPage />} />
                </Routes>
            {/*</HorizontalLayout>*/}
        </Router>
    );
}

export default App;