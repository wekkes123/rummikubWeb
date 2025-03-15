import { React } from 'react';
import { useTranslation } from "react-i18next";
import "./i18n";
//import SeededRandomGenerator from './Components/SeededRNG';
import Frontpage from "./Pages/Frontpage"

function App() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <Frontpage/>
    );
}

export default App;