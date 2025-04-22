import React, { useState, useEffect } from 'react';

const StartScreen = ({ onStart, loadFromStorage }) => {
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useEffect(() => {
        const snapshot = localStorage.getItem('snapshot');
        if (snapshot) {
            setHasSavedGame(true);
        }
    }, []);

    return (
        <div className="start">
            <h1>Welcome to Rummikub!</h1>
            {hasSavedGame && (
                <div>A Previous game was detected, would you like to continue or start a new game?</div>
            )}
            <button onClick={() => onStart()}>Start New Game</button>
            {hasSavedGame && (
                <button onClick={() => loadFromStorage()}>Load Previous Game</button>
            )}
        </div>
    );
};

export default StartScreen;
