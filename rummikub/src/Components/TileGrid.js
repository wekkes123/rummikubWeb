import React, { useState } from 'react';
import Tile from './Tile';
import tileData from './TileData';

const TileGrid = () => {
    const [playerTray, setPlayerTray] = useState(tileData.slice(0, 30)); // Example of 10 tiles in tray
    const [gameMat, setGameMat] = useState([]);

    const moveTileToMat = (tile) => {
        setPlayerTray(playerTray.filter(t => t !== tile));
        setGameMat([...gameMat, tile]);
    };

    const moveTileToTray = (tile) => {
        setGameMat(gameMat.filter(t => t !== tile));
        setPlayerTray([...playerTray, tile]);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Player's Tray</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 100px)',
                gap: '10px',
                justifyContent: 'center',
                backgroundColor: 'lightgray',
                padding: '10px',
                borderRadius: '10px'
            }}>
                {playerTray.map((tile, index) => (
                    <Tile
                        key={index}
                        image={tile.image}
                        value={tile.value}
                        color={tile.color}
                        onClick={() => moveTileToMat(tile)}
                    />
                ))}
            </div>

            <h2>Game Mat</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 100px)',
                gap: '10px',
                justifyContent: 'center',
                backgroundColor: 'gray',
                padding: '10px',
                borderRadius: '10px'
            }}>
                {gameMat.map((tile, index) => (
                    <Tile
                        key={index}
                        image={tile.image}
                        value={tile.value}
                        color={tile.color}
                        onClick={() => moveTileToTray(tile)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TileGrid;
