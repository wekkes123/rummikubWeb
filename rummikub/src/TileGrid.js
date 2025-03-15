import React, { useState } from 'react';
import tileData from './TileData';

const TileContainer = ({ tile, onClick }) => (
    <div
        style={{
            width: '80px',
            height: '120px',
            backgroundColor: 'white',
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px'
        }}
        onClick={onClick}
    >
        {tile && (
            <img
                src={`/tiles/${tile.image}`}
                alt={`Tile ${tile.value}`}
                style={{ width: '70px', height: '110px', borderRadius: '10px' }}
            />
        )}
    </div>
);

const TileGrid = () => {
    const [playerTray, setPlayerTray] = useState(tileData.slice(0, 60));
    const [gameMat, setGameMat] = useState(Array(15 * 15).fill(null));
    const [heldTile, setHeldTile] = useState(null);

    const handlePickUpTile = (tile) => {
        if (!heldTile) {
            setHeldTile(tile);
            setPlayerTray(playerTray.filter(t => t !== tile));
        }
    };

    const handlePlaceTile = (index) => {
        if (heldTile && !gameMat[index]) {
            const newMat = [...gameMat];
            newMat[index] = heldTile;
            setGameMat(newMat);
            setHeldTile(null); // Reset heldTile after placement
        }
    };

    const returnToTray = () => {
        if (heldTile) {
            setPlayerTray([...playerTray, heldTile]);
            setHeldTile(null); // Reset heldTile when returning to tray
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Player's Tray</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 80px)',
                gap: '10px',
                backgroundColor: 'lightgray',
                padding: '10px',
                borderRadius: '10px'
            }}>
                {playerTray.map((tile, index) => (
                    <TileContainer
                        key={index}
                        tile={tile}
                        onClick={() => handlePickUpTile(tile)}
                    />
                ))}
            </div>

            {heldTile && (
                <div>
                    <h3>Holding Tile:</h3>
                    <TileContainer tile={heldTile} onClick={returnToTray} />
                </div>
            )}

            <h2>Game Mat</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, 80px)',
                gap: '5px',
                backgroundColor: 'gray',
                padding: '10px',
                borderRadius: '10px'
            }}>
                {gameMat.map((tile, index) => (
                    <TileContainer
                        key={index}
                        tile={tile}
                        onClick={() => handlePlaceTile(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TileGrid;
