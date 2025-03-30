import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import TileData from "../Components/Logic/TileData";
import GameBoard from '../Components/UI/GameBoard';
import PlayerHand from '../Components/UI/PlayerHand';
import CustomDragLayer from '../Components/UI/CustomDragLayer';
import { createSeededRNG, shuffleArray } from '../Components/Logic/SeededRNG';
import '../css/game.css';
import {Button} from "antd";
import { useNavigate } from 'react-router-dom';
import GameMenu from "../Components/UI/GameMenu";


const GameComponent = () => {
    const { t } = useTranslation();
    const [seed] = useState(() => {
        let storedSeed = localStorage.getItem('seed');
        if (!storedSeed) {
            storedSeed = 'default_seed';
            localStorage.setItem('seed', storedSeed);
        }
        return storedSeed;
    });

    const [leftHanded, setLeftHanded] = useState(false);

    useEffect(() => {
        const storedPreference = localStorage.getItem('handPreference');
        setLeftHanded(storedPreference === 'left');
    }, []);

    const [rng] = useState(() => createSeededRNG(seed));
    const [handTiles, setHandTiles] = useState([]);
    const [boardState, setBoardState] = useState(Array(10).fill().map(() => Array(20).fill(null)));
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
    const [dndKey, setDndKey] = useState(0);
    const [playesTurn, setPlayesTurn] = useState(true);
    const navigate = useNavigate();
    const [remainingTiles, setRemainingTiles] = useState([]);

    // Timer states
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [gameEndTime, setGameEndTime] = useState(null);



    const generateHandTiles = (seed) => {
        const duplicateTiles = TileData.concat(TileData);
        const shuffledTiles = shuffleArray(duplicateTiles, createSeededRNG(seed));
        const hand = shuffledTiles.slice(0, 14).map((tile, index) => ({
            id: index + 1,
            color: tile.color,
            value: tile.value,
            image: tile.image,
        }));
        setHandTiles(hand);
        setRemainingTiles(shuffledTiles.slice(14));
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

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    };

    const handleStopClick = () => {
        const endTime = Date.now();
        setGameEndTime(endTime);
        const gameTime = (endTime - gameStartTime) / 1000; // Game time in seconds
        localStorage.setItem('lastGameTime', gameTime);
        setIsGameStarted(false);
    };

    const handleEndClick = () => {
        if (playesTurn) setPlayesTurn(false);
        else setPlayesTurn(true);
        toggleDragging();
    }

    const handleBack = () => {
        navigate('/');
    };

    const playTilePlaceSound = () => {
        const audio = new Audio("/sounds/place.mp3"); // Adjust path if needed
        audio.play();
    };

    const moveTile = useCallback((id, sourceLocation, targetLocation, targetPosition, sourcePosition) => {
        if (!isDraggingEnabled) return;
        playTilePlaceSound();
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
                let insertIndex = targetPosition;

                // Ensure the insertIndex is within bounds
                if (insertIndex < 0) insertIndex = 0;
                if (insertIndex >= updatedTiles.length) insertIndex = updatedTiles.length;

                updatedTiles.splice(insertIndex, 0, movedTile);

                return updatedTiles;
            });
        }
    }, [boardState, handTiles, isDraggingEnabled]);

    const toggleDragging = useCallback(() => {
        setIsDraggingEnabled(prev => !prev);
        setDndKey(prev => prev + 1);
    }, []);

    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }} key={dndKey}>
            <CustomDragLayer />
            <div className="app">
                {/*
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        color: 'black',
                        top: 20,
                        right: 20,
                        zIndex: 1,
                        fontWeight: 'bold'
                    }}
                >
                    {t('back')}
                </Button>*/}
                {!isGameStarted && (
                    <Button className="start-button" onClick={handleStartClick}>{t('start-game')}</Button>
                )}

                {isGameStarted && (
                    <>
                        <GameMenu/>
                        <GameBoard
                            boardState={boardState}
                            moveTile={moveTile}
                            isDraggingEnabled={isDraggingEnabled}
                        />
                        <PlayerHand
                            tiles={handTiles}
                            moveTile={moveTile}
                            isDraggingEnabled={isDraggingEnabled}
                            leftHanded={leftHanded}
                        />

                        {/*<Button className="stop-button" onClick={handleStopClick}>Stop Game</Button>*/}
                        {/*<Button className="end-button" onClick={handleEndClick}>End Turn</Button>*/}
                    </>
                )}
            </div>
        </DndProvider>
    );
};

export default GameComponent;
