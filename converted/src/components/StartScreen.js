import React from 'react';

function StartScreen({ onStart }) {
    return (
        <div className="start">
            <h2>Welcome to Rummikub!</h2>
            <button className="startbtn" onClick={onStart}>Start</button>
        </div>
    );
}

export default StartScreen;