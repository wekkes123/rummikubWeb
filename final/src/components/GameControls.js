
import React from 'react';
import pile from '../images/draw_card.png';
import done from '../images/checkmark.png';
import restore from '../images/restore.png';
import {t} from "i18next";


function GameControls({ onDraw, onDone, onReverse, pressable, hasPlayed }) {
    return (
        <div className='game-controls'>
            <div className= 'left'>
                <button className="draw" onClick={async () => await onDraw(3)} disabled={!pressable}>
                    {t("draw")}
                    <img src={pile} alt="Restore board" className="pile-button-img" />
                </button>
                <button className="done control-button" onClick={() => onDone()} disabled={!pressable || !hasPlayed}>
                    {t("done")}
                    <img src={done} alt="End Turn" className="done-button-img"/>
                </button>
            </div>
            <div className='right'>
                <button className="reverse control-button" onClick={() => onReverse()} disabled={!pressable}>
                    <img src={restore} alt="Restore board" className="restore" />
                    {t("reverse")}
                </button>
            </div>
        </div>
    );
}

export default GameControls;