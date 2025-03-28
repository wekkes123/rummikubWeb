import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TileData from "../Components/TileData";
import GameBoard from '../Components/GameBoard';
import PlayerHand from '../Components/PlayerHand';
import PileButton from '../Components/PileButton';
import { createSeededRNG, shuffleArray } from '../Components/SeededRNG'; // Import seeded RNG
import '../css/game.css';

const GameComponent = () => {
    const [seed, setSeed] = useState(() => {
        const storedSeed = localStorage.getItem('seed');
        return storedSeed ? storedSeed : 'default_seed';
    });
    const [rng, setRng] = useState(() => createSeededRNG(seed));
    const [handTiles, setHandTiles] = useState([]);
    const [boardState, setBoardState] = useState(Array(10).fill().map(() => Array(20).fill(null)));
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
                        <GameBoard
                            boardState={boardState}
                            moveTile={moveTile}
                            isDraggingEnabled={isDraggingEnabled}
                        />
                        <div className="player-hand-layout-container">
                            <div className="left-button-panel">
                                {/* Add your left panel content here*/}
                                <PileButton
                                    //onClick={handleButtonClick}
                                    disabled={false}
                                />

                            </div>
                            <PlayerHand
                                tiles={handTiles}
                                moveTile={moveTile}
                                isDraggingEnabled={isDraggingEnabled}
                            />
                            <div className="right-button-panel">
                                {/* Add your right panel content here */}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DndProvider>
    );
};

export default GameComponent;
