import React from 'react';
import Tile from './Tile';

function ComputerRack({ tileCount }) {

    const dummyTiles = Array(tileCount).fill(null);

    return (
        <div className="container1">
            <div className="computer-info">
                <p>Computer</p>
                <div>
                    <img src="images/tileBack.png" alt="Tile back" />
                    <span id="c-tile-count">x{tileCount}</span>
                </div>
            </div>
            <div className="computer-rack">
                {dummyTiles.map((_, index) => (
                    <Tile key={`computer-tile-${index}`} isGreyedOut={true} />
                ))}
            </div>
        </div>
    );
}

export default ComputerRack;