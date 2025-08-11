// GameEndScreen.js
import React from 'react';
import { t } from "i18next";

/**
 * creates a visual for the game end screen
 * @param status
 * @param playerScore
 * @param cpuScore
 * @param onRestart
 * @returns {*}
 * @constructor
 */
function GameEndScreen({ status, playerScore, cpuScore, onRestart }) {
    let title = '';
    let message = '';
    let scoreDisplay = null; // This will hold the score JSX
    let screenClass = 'game-end-screen'; // Base class

    if (status === 'win') {
        title = t("winTitle", "You Won!");
        message = t("winMessage", "Congratulations!");
        screenClass += ' win-screen';
        // Display CPU score when winning
        scoreDisplay = <p className="score-info">{t("cpuScore", "CPU Score")}: {cpuScore}</p>;
    } else if (status === 'lose') {
        title = t("loseTitle", "Game Over!");
        message = t("loseMessage", "Better luck next time!");
        screenClass += ' lose-screen';
        // Display Player score when losing
        scoreDisplay = <p className="score-info">{t("yourScore", "Your Score")}: {playerScore}</p>;
    } else {
        title = t("unknownStatusTitle", "Game Ended");
        message = t("unknownStatusMessage", "An unknown game state occurred.");
    }

    return (
        <div className={screenClass}>
            <h2>{title}</h2>
            <p>{message}</p>
            {scoreDisplay} {/* Render the score info here */}
            <button className="restart" onClick={onRestart}>{t("restartButton", "Restart!")}</button>
        </div>
    );
}

export default GameEndScreen;