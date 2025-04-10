import React from 'react';

function GameControls({ onDraw, onDone, onReverse, pressable}) {
    return (
        <div className="game-controls">
            <div className="pouch">
                <button id="draw" className="draw" onClick={() => onDraw(3)} disabled={!pressable} >Draw</button>
                {/*<div>
                    <img src="./images/tileBack.png" alt="Tile back" />
                    <span id="public-pouch">x{pouchCount}</span>
                </div>*/}
            </div>
            <button className="done" onClick={() => onDone()} disabled={!pressable}>Done</button>
            <button className="reverse" onClick={() => onReverse()} disabled={!pressable} >Reverse</button>
        </div>
    );
}

export default GameControls;