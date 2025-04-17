
import React from 'react';
import pile from '../images/draw-pile.png';
import restore from '../images/restore.png';


function GameControls({ onDraw, onDone, onReverse, pressable, lefthanded }) {
    return (
        <div className={`game-controls ${lefthanded ? 'left-handed' : 'right-handed'}`}>
            <div className="controls-container">
                    <button className="draw" onClick={() => onDraw(3)} disabled={!pressable}>
                        {/*<img src={pile} alt="Pick tile from pile" className="pile-button-img" />*/}
                        Draw
                    </button>
                <button className="done control-button" onClick={() => onDone()} disabled={!pressable}>Done</button>
                <button className="reverse control-button" onClick={() => onReverse()} disabled={!pressable}>
                    <img src={restore} alt="Restore board" className="restore" />
                    Reverse
                </button>
            </div>
        </div>
    );
}

export default GameControls;