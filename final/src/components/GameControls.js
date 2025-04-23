
import React from 'react';
import pile from '../images/draw-pile.png';
import restore from '../images/restore.png';
import {t} from "i18next";


function GameControls({ onDraw, onDone, onReverse, pressable, hasPlayed }) {
    return (
        <div className='game-controls'>
            <div className= 'left'>
                <button className="draw" onClick={() => onDraw(3)} disabled={!pressable}>
                    {/*<img src={pile} alt="Pick tile from pile" className="pile-button-img" />*/}
                    {t("draw")}
                </button>
                <button className="done control-button" onClick={() => onDone()} disabled={!pressable || !hasPlayed}>
                    {t("done")}
                </button>
            </div>
            <div className= 'right'>
                <button className="reverse control-button" onClick={() => onReverse()} disabled={!pressable}>
                    <img src={restore} alt="Restore board" className="restore" />
                    {t("reverse")}
                </button>
            </div>
        </div>
    );
}

export default GameControls;