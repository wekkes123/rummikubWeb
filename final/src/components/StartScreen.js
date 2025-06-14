import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StartScreen = ({ onStart, loadFromStorage }) => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const { t } = useTranslation();


    useEffect(() => {
        const snapshot = localStorage.getItem('snapshot');
        if (snapshot) {
            setHasSavedGame(true);
        }
    }, []);

    return (
        <div className="start">
            <h1 style={{ fontSize: "40px", margin: "40px"}}> {t("welcome_message")}</h1>
            {hasSavedGame && (
                <div style={{ fontSize: "20px"}}>{t("previous_game_message")}</div>
            )}
            <div className="start-buttons">
                <button className= "start-button" onClick={() => onStart()}>{t("start_new_game")}</button>
                {hasSavedGame && (
                    <button className= "load-button" onClick={() => loadFromStorage()}>{t("load_previous_game")}</button>
                )}
            </div>
        </div>
    );
};

export default StartScreen;
