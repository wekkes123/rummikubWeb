import React, { useState, useEffect } from 'react';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider} from "react-dnd";
import {t} from "i18next";

import ComputerRack from '../components/ComputerRack';
import GameBoard from '../components/GameBoard';
import PlayerRack from '../components/PlayerRack';
import GameControls from '../components/GameControls';
import StartScreen from '../components/StartScreen';
import CustomDragLayer from '../dragDrop/CustomDragLayer';
import Notification from '../components/Notification'
import WinScreen from "../components/WinScreen";

import { createSeededRNG, shuffleArray } from '../components/Functions/SeededRNG'
import { validateBoard, playedTiles, findJokerValue } from "../components/Functions/gamePlayFunctions";
import { getBestMove } from "../components/cpu/rummikubAPI"
import {
    flyTileBetweenContainers,
    reorderTileMovements,
    findOpenSpot,
    getTileMovements,
    getTileLocationParts,
    getTileLocationsFromBoard
} from "../components/Functions/TileMover";
import {incrementGamesCompleted, saveTime, recordMove} from "../components/Functions/gameplayMetrics";
import ColorPicker from '../components/ColorPicker'; // add this import


import '../App.css';
import '../css/style.css'
import GameEndScreen from "../components/WinScreen";


const backendForDND = TouchBackend;
const backendOptions = { enableMouseEvents: true };
const placeAudio = new Audio("/sounds/place.mp3");

function Game() {
    const [bgColor, setBgColor] = useState('#35654D');
    const [gameStarted, setGameStarted] = useState(false);
    const [startTurnTime, setStartTurnTime] = useState();
    const [startGameTime, setStartGameTime] = useState();
    const [playerWon, setPlayerWon] = useState(false);
    const [playerLose, setPlayerLose] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [cpuScore, setCpuScore] = useState(0);
    const [firstTurn, setFirstTurn] = useState(true);
    const [cpuFirstTurn, setCpuFirstTurn] = useState(true);
    const [boardSnapshot, setBoardSnapshot] = useState(null);
    const [playersTurn, setPlayersTurn] = useState(true);
    const [showNotif, setShowNotif] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [msgNotif, setMsgNotif] = useState("hello");
    const seed = 'ihvjsd';

    const initializeBoard = () => {
        const groups1 = Array(8).fill().map(() => Array(4).fill('0'));
        const groups2 = Array(8).fill().map(() => Array(4).fill('0'));
        const runs = Array(8).fill().map(() => Array(13).fill('0'));
        const playerhand = Array(14)
        const cpuhand = Array(14)

        return [groups1, groups2, runs, playerhand, cpuhand];
    };

    const initializePile = () => {
        let pile = [];
        let joker = "1-j";

        pile.push("1-j");
        pile.push("4-j");

        //fill pouch with all tiles
        for (let k = 0; k < 2; k++) {
            for (let i = 1; i <= 4; i++) {
                for (let j = 1; j <= 13; j++) {
                    pile.push(`${i}-${j}`);
                }
            }
        }

        pile = shuffleArray(pile,createSeededRNG(seed));
        return [pile,joker];
    }

    //step 1 initialize the arrays
    const [board, setBoard] = useState(initializeBoard());
    const [firstTurnBoard, setFirstTurnBoard] = useState(initializeBoard());
    const [initialPile, initialJoker] = initializePile();
    const [pile, setPile] = useState(initialPile);
    const [joker, setJoker] = useState(initialJoker);


    //step 2 wait until both are done then take tiles from pile and put them into the players and cpu's hand
    useEffect(() => {
        if (pile.length === 106) {
            const newPile = [...pile];
            const newPlayerHand = [];
            const newCpuHand = [];


            //pick tiles for playerhand
            for (let i = 0; i < 14; i++) {
                newPlayerHand.push(newPile.pop());
            }

            /*
            //and tiles for the cpu
            for (let i = 0; i < 14; i++) {
                newCpuHand.push(newPile.pop());
            }*/

            const newBoard = [...board];
            newBoard[3] = newPlayerHand;
            newBoard[4] = newCpuHand
            setBoard(newBoard);
            setPile(newPile);
            setBoardSnapshot(JSON.parse(JSON.stringify(newBoard))) //snapshot was taken before the game is done being initialized so for the beginning. json is a way to take a deep copy
        }
    }, [pile, board]);

    useEffect(() => {
        if (board[4].length === 0) {
            handleLose()
        }
    }, [board]);

    useEffect(() => {
        if (playersTurn === true) {//this is needed because otherwise the snapshot is taken before everything is properly initialised
            setStartTurnTime(performance.now());
            if(!firstTurn){
                setHasPlayed(false);
                saveToSnapshot()
            }
        }
    }, [playersTurn]);

    useEffect(() => {
        if (playersTurn === false) {
            setHasPlayed(false);
            setFirstTurnBoard(initializeBoard())
            cpuMove();
        }
    }, [playersTurn]);

    useEffect(() => {
        if (playersTurn === true && gameStarted === true) {
            setHasPlayed(true);
        }
    }, [firstTurnBoard]);

    useEffect(() => {
        console.log(hasPlayed);
    }, [hasPlayed]);

    useEffect(() => {
        console.log("started timer", startTurnTime)
    }, [startTurnTime]);

    const updateBoardTile = (section, groupIndex, tileIndex, value, add = null) => {
        setHasPlayed(true);

        const updateBoardState = (prevBoard) => {
            const newBoard = [...prevBoard];

            if (section === 3) {
                newBoard[section] = [...newBoard[section]];
                newBoard[section][groupIndex] = value;
            } else {
                newBoard[section] = [...newBoard[section]];
                newBoard[section][groupIndex] = [...newBoard[section][groupIndex]];
                newBoard[section][groupIndex][tileIndex] = value;
            }

            return newBoard;
        };

        if (add) {
            setFirstTurnBoard(updateBoardState);
        }
        setBoard(updateBoardState);
    };

    const printB = () => {
        console.log(firstTurnBoard);
        console.log(board);
        console.log(boardSnapshot)
    };

    const removeFromHand = (sectionIndex, handIndex) => {
        const newBoard = [...board];
        const hand = [...newBoard[sectionIndex]];

        if (sectionIndex === 3 && hand.length <= 14) {
            hand[handIndex] = 'empty';
        } else {
            hand.splice(handIndex, 1);
        }

        newBoard[sectionIndex] = hand;
        setBoard(newBoard);
    };

    const getBoardValue = (section, groupIndex, tileIndex, add = null) => {
        if(add){
            if(tileIndex === -1){
                return [board[section][groupIndex], firstTurnBoard[section][groupIndex]];
            }
            return [board[section][groupIndex][tileIndex], firstTurnBoard[section][groupIndex][tileIndex]];
        }
        if(tileIndex === -1){
            return board[section][groupIndex];
        }
        return board[section][groupIndex][tileIndex];
    };

    const cpuMove = async () => {
        try {
            const bestMove = await getBestMove(board[4], board, cpuFirstTurn);
            if (bestMove) {
                console.log("bestmove", bestMove)
                await playCpuMove(bestMove.setsToMake, bestMove.tilesToPlay, bestMove.jokerValue);
                setCpuFirstTurn(false);
                setPlayersTurn(true);
            } else {
                await drawTile(4);
                console.log("CPU has no valid move");
            }
        } catch (error) {
            await drawTile(4);
            console.error("Error during CPU move:", error);
        }
    };

    const isJoker = (tile) => tile && tile.endsWith('-j');

    const playCpuMove = async (moves, tilesFromHand, jokerValue) => {
        const startLocations = getTileLocationsFromBoard(board);
        let simulatedBoard;
        if(cpuFirstTurn){
            simulatedBoard = [...board];
        } else {
            simulatedBoard = initializeBoard();
            simulatedBoard[4] = JSON.parse(JSON.stringify(board[4]));
            simulatedBoard[3] = JSON.parse(JSON.stringify(board[3]));
        }

        const cpuHandLength = simulatedBoard[4].length;
        const cpuHandEnd = simulatedBoard[4].filter(item => !tilesFromHand.includes(item));
        simulatedBoard[4] = tilesFromHand;
        while (simulatedBoard[4].length < cpuHandLength) {
            simulatedBoard[4].push("empty");
        }

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const type = move[0];

            const moveData = move.slice(1);
            if (type === 'g') {
                if (moveData.length === 3) moveData.push('0');

                outerLoop: for (let j = 0; j < simulatedBoard.length; j++) {
                    for (let k = 0; k < simulatedBoard[j].length; k++) {
                        if (Array.isArray(simulatedBoard[j][k]) && simulatedBoard[j][k].every(item => item === '0')) {
                            const boardCopy = structuredClone(simulatedBoard);

                            moveData.forEach((tile, m) => {
                                if (tile !== '0') {
                                    boardCopy[j][k][m] = tile;

                                    const indexToRemove = boardCopy[4].indexOf(tile);
                                    if (indexToRemove !== -1) {
                                        boardCopy[4].splice(indexToRemove, 1);
                                    }
                                }
                            });
                            simulatedBoard = boardCopy;
                            break outerLoop;
                        }
                    }
                }
            }
            else { //todo the checking if the run can fit does not work atm
                const color = parseInt(moveData[0].split('-')[0]);
                const startIndex = (color - 1) * 2;
                const colorArrays = [simulatedBoard[2][startIndex], simulatedBoard[2][startIndex + 1]];
                let targetArrayIndex = -1;

                /*
                const reservedIndices = new Set();

for (let arrayIndex = 0; arrayIndex < colorArrays.length; arrayIndex++) {
    const currentArray = colorArrays[arrayIndex];
    let canFit = true;
    reservedIndices.clear();

    for (const tile of moveData) {
        const [, tileNumber] = tile.split('-');
        let index = isJoker(tile)
            ? jokerValue.find(([t]) => t === tile)?.[1] - 1
            : parseInt(tileNumber) - 1;

        if (!currentArray || currentArray[index] === 1 || reservedIndices.has(index)) {
            canFit = false;
            break;
        }

        reservedIndices.add(index); // mark as reserved
    }

    if (canFit) {
        targetArrayIndex = arrayIndex;
        break;
    }
}
                */

                for (let arrayIndex = 0; arrayIndex < colorArrays.length; arrayIndex++) {
                    const currentArray = colorArrays[arrayIndex];
                    let canFit = true;

                    for (const tile of moveData) {
                        const [, tileNumber] = tile?.split('-') || [];
                        let index = 0;
                        if(isJoker(tile)){
                            for (const tuples of jokerValue) {
                                if(tuples[0] === tile){
                                    index = tuples[1] - 1;
                                }
                            }
                        } else {
                            index = parseInt(tileNumber) - 1;
                        }

                        if (!currentArray || currentArray[index] !== '0') {
                            canFit = false;
                            break;
                        }
                    }
                    if (canFit) {
                        targetArrayIndex = arrayIndex;
                        break;
                    }
                }
                if (targetArrayIndex !== -1) {
                    const boardCopy = structuredClone(simulatedBoard);

                    for (const tile of moveData) {
                        const [, tileNumber] = tile?.split('-') || [];
                        let index = 0;
                        if(isJoker(tile)){
                            for (const tuples of jokerValue) {
                                if(tuples[0] === tile){
                                    index = tuples[1] - 1;
                                }
                            }
                        } else {
                            index = parseInt(tileNumber) - 1;
                        }

                        boardCopy[2][startIndex + targetArrayIndex][index] = tile;

                        const indexToRemove = boardCopy[4].indexOf(tile);
                        if (indexToRemove !== -1) {
                            boardCopy[4].splice(indexToRemove, 1);
                        }
                    }

                    simulatedBoard = boardCopy;
                }
            }
        }
        const endLocations = getTileLocationsFromBoard(simulatedBoard);
        const unorderedTileMovements = getTileMovements(startLocations, endLocations);
        const openTile = findOpenSpot(board,simulatedBoard);
        const tileMovements = reorderTileMovements(unorderedTileMovements,openTile);
        let currentBoard = structuredClone(board);
        for (const move of tileMovements) {
            const { tile, from, to } = move;

            const fromLoc = getTileLocationParts(from);
            const toLoc = getTileLocationParts(to);

            if (fromLoc.type === 'group') {
                const { sectionIndex, groupIndex, tileIndex } = fromLoc;
                currentBoard[sectionIndex][groupIndex][tileIndex] = '0';
            } else if (fromLoc.type === 'run') {
                currentBoard[2][fromLoc.runIndex][fromLoc.tileIndex] = '0';
            } else if (fromLoc.type === 'cpuhand') {
                const cpuHand = currentBoard[4];
                const tileIndex = cpuHand.indexOf(tile);
                if (tileIndex !== -1) {
                    cpuHand.splice(tileIndex, 1);
                }
            }

            setBoard(structuredClone(currentBoard));

            const fromElem = document.querySelector(`[data-location="${from}"]`)
                || document.querySelector('.computer-rack');
            const toElem = document.querySelector(`[data-location="${to}"]`);

            if (fromElem && toElem) {
                await new Promise(resolve =>
                    flyTileBetweenContainers({
                        tile,
                        fromElem,
                        toElem,
                        onComplete: resolve
                    })
                );
                placeAudio.play(); //this place audio is 0.41 seconds so the animation needs to be longer for the audio to not bug out
            }

            if (toLoc.type === 'group') {
                const { sectionIndex, groupIndex, tileIndex } = toLoc;
                while (currentBoard.length <= sectionIndex) currentBoard.push([]);
                while (currentBoard[sectionIndex].length <= groupIndex) currentBoard[sectionIndex].push([]);
                while (currentBoard[sectionIndex][groupIndex].length <= tileIndex) currentBoard[sectionIndex][groupIndex].push('0');
                currentBoard[sectionIndex][groupIndex][tileIndex] = tile;
            } else if (toLoc.type === 'run') {
                const { runIndex, tileIndex } = toLoc;
                if (!currentBoard[2][runIndex]) {
                    currentBoard[2][runIndex] = [];
                }
                if (isJoker(tile)) {
                    currentBoard[2][runIndex][tileIndex] = tile;
                } else {
                    currentBoard[2][runIndex][tileIndex] = 1;
                }
            } else if (toLoc.type === 'cpuhand') {
                currentBoard[4].push(tile);
            }
            setBoard(structuredClone(currentBoard));
        }
        for (let i = 0; i < simulatedBoard[2].length; i++) {
            let row = simulatedBoard[2][i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== '0' && row[j] !== "1-j" && row[j] !== '4-j') {
                    row[j] = 1;
                }
            }
        }
        simulatedBoard[4] = cpuHandEnd;
        console.log("at the end:", simulatedBoard);
        setBoard(simulatedBoard);
    };

    //todo pulling a tile when already playing a tile on the board works
    const onDone = () => {
        const endTurnTime = performance.now();
        //step 1 is the board correct?
        if(!validateBoard(board)){
            console.log("board isnt correct")
            setMsgNotif(t("The board is not correct"))
            setShowNotif(true);
            recordMove({successfulMove: false, drewFromPile: false});
            return;
        }

        const playedtiles = playedTiles(boardSnapshot[3],board[3]);//step 2 did the player put down a tile? //todo something goes wrong here and the played tiles are not representative
        console.log(playedtiles)
        if(playedtiles.length === 0){
            setMsgNotif(t("You Have to place or draw a tile!"))
            setShowNotif(true);
            recordMove({successfulMove: false, drewFromPile: false});
            return;
        } else if(firstTurn){ //if they did and its their first turn -> check if they played 30 points and if they didnt use another players's tiles
            let count = 0;
            for(const tile of playedtiles){
                const [, number] = tile.split('-').map(Number)
                if (Number.isNaN(number)) {// .map tries to convert the number of the tile to a number, if its a joker -> convers to NaN
                    count += findJokerValue(board,tile);
                    continue;
                }
                count += number;
            }
            console.log(count);
            if (count < 30){
                setMsgNotif(t(">30notify"))
                setShowNotif(true);
                console.log("less than 30 on first turn")
                recordMove({successfulMove: false, drewFromPile: false});
                return;
            } else {
                if(!validateBoard(firstTurnBoard)){
                    console.log("You used other players' tile to get to 30")
                    setMsgNotif(t("30other-notify"))
                    setShowNotif(true);
                    recordMove({successfulMove: false, drewFromPile: false});
                    return;
                }
                setFirstTurn(false);
            }
        }
        if (board[3].every(item => item === 'empty')) {
            handleWin()
        }
        console.log("ending turn")
        recordMove({successfulMove: true, drewFromPile: false});
        saveTime(startTurnTime, endTurnTime, "moveTime",{move:"Played 1 or more tiles"});
        setPlayersTurn(false)
    }

    const saveToSnapshot = () => {
        console.log("snapshot taken");
        const snapshot = board.map(section =>
            section.map(group =>
                Array.isArray(group) ? [...group] : group
            )
        );
        localStorage.setItem("firstTurn", JSON.stringify(firstTurn));
        localStorage.setItem('snapshot', JSON.stringify(snapshot));
        localStorage.setItem('cpuFirstTurn', JSON.stringify(cpuFirstTurn));
        localStorage.setItem('pile', JSON.stringify(pile));
        setBoardSnapshot(snapshot);
    };

    const loadFromStorage = () => {
        const snapshot = JSON.parse(localStorage.getItem("snapshot"));
        const firstTurn = JSON.parse(localStorage.getItem("firstTurn"));
        const cpuFirstTurn = JSON.parse(localStorage.getItem("cpuFirstTurn"));
        const pile = JSON.parse(localStorage.getItem("pile"));

        if (snapshot && pile !== null && firstTurn !== null && cpuFirstTurn !== null) {
            setBoard(snapshot);
            setBoardSnapshot(snapshot);
            setFirstTurn(firstTurn);
            setCpuFirstTurn(cpuFirstTurn);
            setPile(pile);
        } else {
            handleStartGame()
            setMsgNotif("Something went wrong while loading the previous game, we have started a new one")
            setShowNotif(true);
            return;
        }
        handleStartGame();
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const restoreFromSnapshot = () => {
        const restoredBoard = boardSnapshot.map(section =>
            section.map(group =>
                Array.isArray(group) ? [...group] : group
            )
        );
        setFirstTurnBoard(initializeBoard())
        setBoard(restoredBoard);
    };

    //this is special use effect logic because the draw tile function need to wait for board updates to end before applying animations and setting the new board.
    const [drawPending, setDrawPending] = useState(false);
    const [drawIndex, setDrawIndex] = useState(null);

    useEffect(() => {
        if (drawPending && drawIndex !== null) {
            actuallyDrawTile(drawIndex, board);
            setDrawPending(false);
            setDrawIndex(null);
        }
    }, [drawPending, drawIndex, board]);

    const drawTile = (index) => {
        if (index === 3) {
            setBoard(boardSnapshot);
            setDrawIndex(index);
            setDrawPending(true);
        } else {
            actuallyDrawTile(index, board);
        }
    };


    //index is used so you can use this function to add to the cpus hand index = 4 or the players hand index = 3
    const actuallyDrawTile = async (index, currentBoard) => {
        const endTurnTime = performance.now();
        const newPile = [...pile];
        const drawnTile = newPile.pop();
        const newHand = [...currentBoard[index]];

        if (!newHand.includes('empty')) {
            newHand.push('empty');
            currentBoard[index] = newHand;
            setBoard([...currentBoard]);
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        const indexOfHand = newHand.indexOf('empty');

        const fromElem = document.querySelector('.draw');
        const loc = index === 3 ? `hand-${indexOfHand}` : index === 4 ? `cpuhand-0` : null;
        const animationTile = index === 4 ? '0' : drawnTile;
        const toElem = document.querySelector(`[data-location='${loc}']`);

        if (fromElem && toElem) {
            await new Promise(resolve =>
                flyTileBetweenContainers({
                    tile: animationTile,
                    fromElem,
                    toElem,
                    onComplete: resolve
                })
            );
            placeAudio.play();
        }

        newHand[indexOfHand] = drawnTile;
        currentBoard[index] = newHand;

        setBoard([...currentBoard]);
        setPile(newPile);
        saveTime(startTurnTime, endTurnTime, "moveTime", { move: "Has drawn a tile" });
        if (playersTurn) recordMove({ successfulMove: true, drewFromPile: true });
        setPlayersTurn(!playersTurn);
    };



    const onDragStart = (endTime = null) => {
        if(!hasPlayed){
            saveTime(startTurnTime,endTime);
        }
    }

    const handleStartGame = () => {
        localStorage.removeItem("thinkTime");
        localStorage.removeItem(`playerStats_${localStorage.getItem("username")}`);
        setPlayerWon(false)
        setPlayerLose(false);
        setGameStarted(true)
        setStartTurnTime(performance.now())
    };

    const handleWin = () => {
        setPlayerWon(true);
        incrementGamesCompleted();
        setCpuScore(calculateCpuScore());
        setPlayerScore(calculatePlayerScore());
    }

    const handleLose = () => {
        setPlayerLose(true);
        incrementGamesCompleted();
        setPlayerScore(calculatePlayerScore());
        setCpuScore(calculateCpuScore());
    }

    const calculatePlayerScore = () => {
        const playerHand = board[3];
        let score = 0;
        for (const tile of playerHand) {
            if (tile !== 'empty') {
                const [, numberStr] = tile.split('-');
                const number = parseInt(numberStr);
                if (!isNaN(number)) {
                    score += number;
                } else if (tile.endsWith('-j')) {
                    score += 25; //penalty for a joker left in hand
                }
            }
        }
        return score;
    };

    const calculateCpuScore = () => {
        const cpuHand = board[4];
        let score = 0;
        for (const tile of cpuHand) {
            if (tile !== 'empty') {
                const [, numberStr] = tile.split('-');
                const number = parseInt(numberStr);
                if (!isNaN(number)) {
                    score += number;
                } else if (tile.endsWith('-j')) {
                    score += 25; // penalty for a joker left in hand
                }

            }
        }
        return score;
    };

    // Handle failed drag operations
    const handleDragEnd = (item) => {
        console.log("Drag ended without successful drop for item:", item);
    };

    return (
        <DndProvider backend={backendForDND} options={backendOptions}>
            {/*<ColorPicker color={bgColor} onChange={(color) => setBgColor(color.hex)} />*/}
            <div className="app" style={{background: bgColor}}>
                <CustomDragLayer  />

                <Notification message={msgNotif} isVisible={showNotif} onClose={() => setShowNotif(false)}/>
                <div id="tile-overlay-root"></div>
                <div className={`game-container ${!gameStarted || playerWon ? 'blurred' : ''}`} style={{background: bgColor}}>
                    <ComputerRack cpuhand={board[4]}/>
                    <GameBoard
                        board={board}
                        updateBoardTile={updateBoardTile}
                        removeFromHand={removeFromHand}
                        getBoardValue={getBoardValue}
                        tilesAreDraggable={playersTurn}
                        firstTurn={firstTurn}
                        onDragStart={onDragStart}
                    />
                    <PlayerRack
                        playerhand={board[3]}
                        board={board}
                        firstTurnBoard={firstTurnBoard}
                        removeFromHand={removeFromHand}
                        updateBoardTile = {updateBoardTile}
                        onDragEnd={handleDragEnd}
                        setBoard={setBoard}
                        setFirstTurnBoard={setFirstTurnBoard}
                        getBoardValue={getBoardValue}
                        tilesAreDraggable={playersTurn}
                    />
                    <GameControls
                        onDraw={drawTile}
                        onDone={onDone}
                        //onReverse={restoreFromSnapshot}
                        onReverse={printB}
                        pressable={playersTurn}
                        hasPlayed={hasPlayed}
                    />
                </div>
                {playerWon && (
                    <GameEndScreen
                        status="win"
                        playerScore={playerScore}
                        cpuScore={cpuScore}
                        onRestart={handleStartGame}
                    />
                )}
                {playerLose && (
                    <GameEndScreen
                        status="lose"
                        playerScore={playerScore}
                        cpuScore={cpuScore}
                        onRestart={handleStartGame}
                    />
                )}
                {!gameStarted && <StartScreen onStart={handleStartGame} loadFromStorage={loadFromStorage}/>}
            </div>
        </DndProvider>
    );
}

export default Game;