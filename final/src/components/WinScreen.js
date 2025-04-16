import React from 'react';

function WinScreen({ onRestart }) {
    return (
        <div className="win">
            <h2>You Win!</h2>
            <button className="restart" onClick={onRestart}>Restart!</button>
        </div>
    );
}

export default WinScreen;