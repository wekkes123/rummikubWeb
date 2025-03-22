import React, { useState, useEffect } from 'react';
import { createSeededRNG } from "./SeededRNG";
import Tile from "./Tile";  // Make sure Tile is correctly imported
import tileData from './TileData'; // Import your tileData

export function shuffleArray(array, rngFunction) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rngFunction() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

const TilePicker = () => {
    const [seed, setSeed] = useState("default_seed");
    const [tileSet, setTileSet] = useState([]);
    const [rng, setRng] = useState(() => createSeededRNG(seed));

    // Duplicate each tile to ensure there are two of each
    const allTiles = [...tileData, ...tileData]; // Double the tiles so each tile appears twice

    useEffect(() => {
        if (seed) {
            setRng(() => createSeededRNG(seed));
        }
    }, [seed]);

    const pickRandomTiles = (numTiles) => {
        if (!rng) {
            alert("Please enter a seed first!");
            return;
        }

        const shuffledTiles = shuffleArray(allTiles, rng);
        const pickedTiles = shuffledTiles.slice(0, numTiles); // Pick the specified number of tiles

        setTileSet(pickedTiles);
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '400px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Pick Rummikub Tiles</h2>

            <div style={{ marginBottom: '16px' }}>
                <label htmlFor="seed" style={{ display: 'block', marginBottom: '4px' }}>Seed Value</label>
                <input
                    id="seed"
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Enter seed for randomization"
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label htmlFor="numTiles" style={{ display: 'block', marginBottom: '4px' }}>Number of Tiles to Pick</label>
                <input
                    id="numTiles"
                    type="number"
                    min="1"
                    max="14"
                    defaultValue="14"
                    onChange={(e) => pickRandomTiles(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Picked Tiles:</label>
                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    {tileSet.map((tile, index) => {
                        return (
                            <Tile
                                key={index}
                                id={tile.value + tile.color}  // Use a combination of value and color as ID
                                value={tile.value}
                                color={tile.color}
                                location="picked" // Adjust location if needed
                                position={index} // Adjust position logic if needed
                                moveTile={() => {}}  // Assuming no dragging is required for now
                                isDraggingEnabled={true} // Dragging disabled for now
                            />
                        );
                    })}
                </div>
            </div>

            <button
                onClick={() => pickRandomTiles(14)}
                style={{
                    backgroundColor: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                }}
            >
                Pick 14 Tiles
            </button>
        </div>
    );
};

export default TilePicker;
