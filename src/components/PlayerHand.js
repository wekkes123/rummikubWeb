import React from 'react';
import { useDrop } from 'react-dnd';
import Tile from './Tile';

const PlayerHand = ({ tiles, moveTile, isDraggingEnabled }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'tile',
        drop: (item) => {
            if (isDraggingEnabled) {
                moveTile(item.id, item.location, 'hand', null, item.position);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
        canDrop: () => isDraggingEnabled,
    }), [moveTile, isDraggingEnabled]);

    return (
        <div
            ref={drop}
            className="player-hand"
            style={{
                backgroundColor: isOver && isDraggingEnabled ? '#f0f0f0' : '#efefef',
            }}
        >
            {tiles.map((tile) => (
                <Tile
                    key={tile.id}
                    id={tile.id}
                    value={tile.value}
                    color={tile.color}
                    location="hand"
                    moveTile={moveTile}
                    isDraggingEnabled={isDraggingEnabled}
                />
            ))}
        </div>
    );
};

export default PlayerHand;
