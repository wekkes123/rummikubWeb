import { React } from 'react';
import { useTranslation } from "react-i18next";
import "./i18n";
//import SeededRandomGenerator from './Components/SeededRNG';

function App() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            yo
            <h1>{t("welcome")}</h1>
            <p>{t("description")}</p>
            <button onClick={() => changeLanguage("en")}>English</button>
            <button onClick={() => changeLanguage("nl")}>Nederlands</button>
        </div>
    );
}

export default App;