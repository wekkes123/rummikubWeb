import { React } from 'react';
import { useTranslation } from "react-i18next";
import { Button } from 'antd';
import TileGrid from './TileGrid';
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
            <Button onClick={() => changeLanguage("en")}>English</Button>
            <Button onClick={() => changeLanguage("nl")}>Nederlands</Button>
            <TileGrid />
        </div>
    );
}

export default App;