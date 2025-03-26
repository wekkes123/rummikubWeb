import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useDrop } from 'react-dnd';
import Tile from './Tile';
import TileSorter from './Sort';

const MAX_SLOTS = 20;

const PlayerHand = ({ tiles, moveTile, isDraggingEnabled }) => {
    const [displayTiles, setDisplayTiles] = useState([...tiles, ...Array(MAX_SLOTS - tiles.length).fill(null)]);

    useEffect(() => {
        const updatedDisplayTiles = [...displayTiles];
        const missingTiles = displayTiles.filter(tile => tile && !tiles.some(t => t.id === tile.id));

        missingTiles.forEach(missingTile => {
            const index = updatedDisplayTiles.findIndex(t => t && t.id === missingTile.id);
            if (index !== -1) {
                updatedDisplayTiles[index] = null;
            }
        });
        const finalDisplayTiles = [
            ...updatedDisplayTiles,
            ...Array(MAX_SLOTS - updatedDisplayTiles.length).fill(null)
        ];
        setDisplayTiles(finalDisplayTiles);
    }, [ tiles]);

    const applySort = (sortBy) => {
        const newSortedTiles = TileSorter(tiles.filter(Boolean), sortBy);
        setDisplayTiles([...newSortedTiles, ...Array(MAX_SLOTS - newSortedTiles.length).fill(null)]);
    };

    const moveTileInHand = (tileId, newIndex) => {
        const tileIndex = displayTiles.findIndex(tile => tile && tile.id === tileId);
        if (tileIndex === -1 || tileIndex === newIndex) return; // Tile not found or same position

        const updatedTiles = [...displayTiles];
        [updatedTiles[tileIndex], updatedTiles[newIndex]] = [updatedTiles[newIndex], updatedTiles[tileIndex]];

        setDisplayTiles(updatedTiles);
    };

    return (
        <div>
            <Button
                onClick={() => applySort('value')}
                style={{ marginBottom: '10px' }}
                className={'swap-sort-button'}>
                Sort by Value
            </Button>
            <Button
                onClick={() => applySort('color')}
                style={{ marginBottom: '10px' }}
                className={'swap-sort-button'}>
                Sort by Color
            </Button>


            <div className="player-hand" style={{ backgroundColor: '#efefef', display: 'flex' }}>
                <div className={'player-hand-line'}></div>
                {displayTiles.map((tile, index) => (
                    <TileSlot
                        key={index}
                        index={index}
                        tile={tile}
                        moveTile={moveTile}
                        moveTileInHand={moveTileInHand}
                        isDraggingEnabled={isDraggingEnabled}
                    />
                ))}
            </div>
        </div>
    );
};

const TileSlot = ({ index, tile, moveTile, moveTileInHand, isDraggingEnabled }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'tile',
        drop: (item) => {
            if (isDraggingEnabled) {
                if (item.location === 'hand') {
                    moveTileInHand(item.id, index);
                } else if (item.location === 'board') {
                    moveTile(item.id, item.location, 'hand', index);
                }
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [moveTile, moveTileInHand, isDraggingEnabled, index]);

    return (
        <div
            ref={drop}
            className="tile-slot"
            style={{
                backgroundColor: isOver ? '#ddd' : 'transparent',
                width: '60px',
                height: '90px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed #aaa',
                margin: '5px',
            }}
        >
            {tile ? (
                <Tile
                    key={tile.id}
                    id={tile.id}
                    color={tile.color}
                    value={tile.value}
                    location="hand"
                    moveTile={moveTile}
                    isDraggingEnabled={isDraggingEnabled}
                />
            ) : (
                <div className="empty-slot" style={{ width: '50px', height: '70px' }} />
            )}
        </div>
    );
};

export default PlayerHand;
