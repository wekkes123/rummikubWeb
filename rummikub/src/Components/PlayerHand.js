import React, { useState } from 'react';
import { Button } from 'antd'; // Import Ant Design Button
import { useDrop } from 'react-dnd';
import Tile from './Tile';
import TileSorter from './Sort'; // Import TileSorter component

const PlayerHand = ({ tiles, moveTile, isDraggingEnabled }) => {
    const [sortBy, setSortBy] = useState(null);

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

    const sortedTiles = TileSorter({ tiles, sortby: sortBy });

    const valueSort = () => {
        setSortBy('value');
    };
    const colorSort = () => {
        setSortBy('color');
    };

    return (
        <div>
            <Button
                onClick={valueSort}
                className="swap-sort-button"
                style={{ marginBottom: '10px'}}
            >
                Swap Sort ({'By Value'})
            </Button>
            <Button
                onClick={colorSort}
                className="swap-sort-button"
                style={{ marginBottom: '10px'}}
            >
                Swap Sort ({'By Color'})
            </Button>
            <div
                ref={drop}
                className="player-hand"
                style={{
                    backgroundColor: isOver && isDraggingEnabled ? '#f0f0f0' : '#efefef',
                }}
            >
                {sortedTiles.map((tile) => (
                    <Tile
                        key={tile.id}
                        id={tile.id}
                        color={tile.color}
                        value={tile.value}
                        location="hand"
                        moveTile={moveTile}
                        isDraggingEnabled={isDraggingEnabled}
                    />
                ))}
            </div>
    </div>
    );
};

export default PlayerHand;
