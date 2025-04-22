import React from 'react';
import {t} from "i18next";

function WinScreen({ onRestart }) {
    return (
        <div className="win">
            <h2>{t("win")}</h2>
            <button className="restart" onClick={onRestart}>Restart!</button>
        </div>
    );
}

export default WinScreen;