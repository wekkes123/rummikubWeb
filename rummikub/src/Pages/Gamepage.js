import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TileData from "../Components/TileData";
import GameBoard from '../Components/GameBoard';
import PlayerHand from '../Components/PlayerHand';
import { createSeededRNG, shuffleArray } from '../Components/SeededRNG'; // Import seeded RNG
import './game.css';
const GameComponent = () => {
    // State for seed input and RNG function
    const [seed, setSeed] = useState('defaultSeed123');
    const [rng, setRng] = useState(() => createSeededRNG(Date.now())); // Default RNG based on time
    const [handTiles, setHandTiles] = useState([]);
    const [boardState, setBoardState] = useState(
        Array(5).fill().map(() => Array(5).fill(null))
    );
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
    const [dndKey, setDndKey] = useState(0);

    const handleSeedChange = (e) => {
        const newSeed = e.target.value;
        setSeed(newSeed);
        // Recreate RNG with new seed
        setRng(() => createSeededRNG(newSeed));
        // Re-generate the hand tiles based on the new seed
        generateHandTiles(newSeed);
    };

    // Generate hand tiles based on seed
    const generateHandTiles = (seed) => {
        const shuffledTiles = shuffleArray(TileData, createSeededRNG(seed)); // Use the RNG for shuffling
        setHandTiles(shuffledTiles.slice(0, 14).map((tile, index) => ({
            id: index + 1,
            color: tile.color,
            value: tile.value,
            image: tile.image,
        })));
    };

    useEffect(() => {
        if (seed) {
            generateHandTiles(seed); // Generate tiles when seed changes
        }
    }, [rng, seed]);

    // Function to move tiles between locations
    const moveTile = useCallback((id, sourceLocation, targetLocation, targetPosition, sourcePosition) => {
        if (!isDraggingEnabled) return; // Prevent moves when dragging is disabled

        // Case 1: Moving from hand to board
        if (sourceLocation === 'hand' && targetLocation === 'board') {
            const tile = handTiles.find(t => t.id === id);
            if (!tile) return;

            // Check if target position is empty
            if (boardState[targetPosition.y][targetPosition.x] === null) {
                // Create new board state
                const newBoardState = [...boardState];
                newBoardState[targetPosition.y][targetPosition.x] = { ...tile };

                // Remove from hand
                setHandTiles(prev => prev.filter(t => t.id !== id));
                setBoardState(newBoardState);
            }
        }

        // Case 2: Moving from board to hand
        else if (sourceLocation === 'board' && targetLocation === 'hand') {
            let tileToMove = null;
            let tileX = -1, tileY = -1;

            if (sourcePosition) {
                tileX = sourcePosition.x;
                tileY = sourcePosition.y;
                tileToMove = boardState[tileY][tileX];
            } else {
                // Fallback search if position is not provided
                for (let y = 0; y < boardState.length; y++) {
                    for (let x = 0; x < boardState[y].length; x++) {
                        if (boardState[y][x] && boardState[y][x].id === id) {
                            tileToMove = { ...boardState[y][x] };
                            tileX = x;
                            tileY = y;
                            break;
                        }
                    }
                    if (tileToMove) break;
                }
            }

            if (tileToMove) {
                // Add to hand
                setHandTiles(prev => [...prev, tileToMove]);

                // Remove from board
                const newBoardState = [...boardState];
                newBoardState[tileY][tileX] = null;
                setBoardState(newBoardState);
            }
        }

        // Case 3: Moving from board to another position on board
        else if (sourceLocation === 'board' && targetLocation === 'board') {
            if (!sourcePosition) return;

            const sourceTile = boardState[sourcePosition.y][sourcePosition.x];
            if (!sourceTile) return;

            // Check if target position is empty
            if (boardState[targetPosition.y][targetPosition.x] === null) {
                // Create new board state
                const newBoardState = [...boardState];

                // Move tile
                newBoardState[targetPosition.y][targetPosition.x] = { ...sourceTile };
                newBoardState[sourcePosition.y][sourcePosition.x] = null;

                setBoardState(newBoardState);
            }
        }
    }, [boardState, handTiles, isDraggingEnabled]);

    // Toggle drag functionality
    const toggleDragging = useCallback(() => {
        setIsDraggingEnabled(prev => !prev);
        setDndKey(prev => prev + 1);
    }, []);

    return (
        <DndProvider backend={HTML5Backend} key={dndKey}>
            <div className="app">
                <div className="controls">
                    <button
                        className={`toggle-button ${isDraggingEnabled ? 'enabled' : 'disabled'}`}
                        onClick={toggleDragging}
                    >
                        Dragging is {isDraggingEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>

                <div className="seed-input">
                    <label htmlFor="seed">Enter Seed:</label>
                    <input
                        id="seed"
                        type="text"
                        value={seed}
                        onChange={handleSeedChange}
                        placeholder="Enter any seed (e.g., a string or number)"
                    />
                </div>

                <GameBoard
                    boardState={boardState}
                    moveTile={moveTile}
                    isDraggingEnabled={isDraggingEnabled}
                />

                <div className="hand-section">
                    <h2>Your Tiles</h2>
                    <PlayerHand
                        tiles={handTiles}
                        moveTile={moveTile}
                        isDraggingEnabled={isDraggingEnabled}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default GameComponent;