import React from 'react';
import DraggableTile from '../dragDrop/DraggableTile';
import Tile from './Tile';

function PlayerRack({ playerhand, onDragEnd, tilesAreDraggable = true }) {
    return (
        <div className="container3">
            <div className="player-rack">
                {playerhand.map((tile, index) => {
                    // Split the tile string by the hyphen
                    const [color, number] = tile.split('-');

                    // Common tile props
                    const tileProps = {
                        key: `${tile}-${index}`, //could cause uniqueness issues
                        id: tile,
                        color: color,
                        number: number,
                        isHighlighted: 1,
                        location: `hand-${index}`,
                        curlo: tile.curlo
                    };

                    return tilesAreDraggable ? (
                        <DraggableTile
                            {...tileProps}
                            onDragEnd={onDragEnd}
                        />
                    ) : (
                        <Tile {...tileProps} />
                    );
                })}
            </div>
        </div>
    );
}

export default PlayerRack;