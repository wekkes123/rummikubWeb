import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TileData from "../Components/TileData";
import GameBoard from '../Components/GameBoard';
import PlayerHand from '../Components/PlayerHand';
import { createSeededRNG, shuffleArray } from '../Components/SeededRNG'; // Import seeded RNG
import './game.css';

const GameComponent = () => {
    const [seed, setSeed] = useState(() => {
        const storedSeed = localStorage.getItem('seed');
        return storedSeed ? storedSeed : 'default_seed';
    });
    const [rng, setRng] = useState(() => createSeededRNG(seed));
    const [handTiles, setHandTiles] = useState([]);
    const [boardState, setBoardState] = useState(Array(5).fill().map(() => Array(5).fill(null)));
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
    const [dndKey, setDndKey] = useState(0);

    // Timer states
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [gameEndTime, setGameEndTime] = useState(null);

    const handleSeedChange = (e) => {
        const newSeed = e.target.value;
        setSeed(newSeed);
        localStorage.setItem('seed', newSeed);
        setRng(() => createSeededRNG(newSeed));
        generateHandTiles(newSeed);
    };

    const generateHandTiles = (seed) => {
        const shuffledTiles = shuffleArray(TileData, createSeededRNG(seed));
        setHandTiles(shuffledTiles.slice(0, 14).map((tile, index) => ({
            id: index + 1,
            color: tile.color,
            value: tile.value,
            image: tile.image,
        })));
    };

    useEffect(() => {
        if (seed) {
            generateHandTiles(seed);
        }
    }, [rng, seed]);

    const handleStartClick = () => {
        setIsGameStarted(true);
        const startTime = Date.now();
        setGameStartTime(startTime);
    };

    const handleStopClick = () => {
        const endTime = Date.now();
        setGameEndTime(endTime);
        const gameTime = (endTime - gameStartTime) / 1000; // Game time in seconds
        localStorage.setItem('lastGameTime', gameTime);
        setIsGameStarted(false);
    };

    const moveTile = useCallback((id, sourceLocation, targetLocation, targetPosition, sourcePosition) => {
        if (!isDraggingEnabled) return;

        if (sourceLocation === 'hand' && targetLocation === 'board') {
            const tile = handTiles.find(t => t.id === id);
            if (!tile) return;

            if (boardState[targetPosition.y][targetPosition.x] === null) {
                const newBoardState = [...boardState];
                newBoardState[targetPosition.y][targetPosition.x] = { ...tile };
                setHandTiles(prev => prev.filter(t => t.id !== id));
                setBoardState(newBoardState);
            }
        } else if (sourceLocation === 'board' && targetLocation === 'hand') {
            let tileToMove = null;
            let tileX = -1, tileY = -1;

            if (sourcePosition) {
                tileX = sourcePosition.x;
                tileY = sourcePosition.y;
                tileToMove = boardState[tileY][tileX];
            } else {
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
                setHandTiles(prev => [...prev, tileToMove]);
                const newBoardState = [...boardState];
                newBoardState[tileY][tileX] = null;
                setBoardState(newBoardState);
            }
        } else if (sourceLocation === 'board' && targetLocation === 'board') {
            if (!sourcePosition) return;

            const sourceTile = boardState[sourcePosition.y][sourcePosition.x];
            if (!sourceTile) return;

            if (boardState[targetPosition.y][targetPosition.x] === null) {
                const newBoardState = [...boardState];
                newBoardState[targetPosition.y][targetPosition.x] = { ...sourceTile };
                newBoardState[sourcePosition.y][sourcePosition.x] = null;
                setBoardState(newBoardState);
            }
        }
        else if (sourceLocation === 'hand' && targetLocation === 'hand') {
            setHandTiles(prev => {
                const updatedTiles = [...prev];
                const sourceIndex = updatedTiles.findIndex(t => t.id === id);
                if (sourceIndex === -1) return prev;

                const [movedTile] = updatedTiles.splice(sourceIndex, 1);
                updatedTiles.splice(targetPosition, 0, movedTile);

                return updatedTiles;
            });

        }
    }, [boardState, handTiles, isDraggingEnabled]);

    const toggleDragging = useCallback(() => {
        setIsDraggingEnabled(prev => !prev);
        setDndKey(prev => prev + 1);
    }, []);

    return (
        <DndProvider backend={HTML5Backend} key={dndKey}>
            <div className="app">
                {!isGameStarted && (
                    <button className="start-button" onClick={handleStartClick}>Start Game</button>
                )}

                {isGameStarted && (
                    <>
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

                        <button className="stop-button" onClick={handleStopClick}>Stop Game</button>
                    </>
                )}
            </div>
        </DndProvider>
    );
};

export default GameComponent;
