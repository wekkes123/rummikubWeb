import {createSeededRNG, shuffleArray} from "./SeededRNG";
import {useState} from "react";
import {getBestMove} from "../cpu/rummikubAPI";
import {
    findOpenSpot, flyTileBetweenContainers, getTileLocationParts,
    getTileLocationsFromBoard,
    getTileMovements,
    moveReducer,
    reorderTileMovements
} from "./TileMover";


import {incrementGamesCompleted, recordMove, saveTime} from "./gameplayMetrics";

const placeAudio = new Audio("/sounds/place.wav");

//function for playing the place sound and resetting the playback position
const playPlaceSound = () => {
    placeAudio.currentTime = 0;
    placeAudio.play();
};


export function useGameLogic() {
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
    const [seed, setSeed] = useState('');
    const [drawPending, setDrawPending] = useState(false);
    const [drawIndex, setDrawIndex] = useState(null);


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

    const [board, setBoard] = useState(initializeBoard());
    const [firstTurnBoard, setFirstTurnBoard] = useState(initializeBoard());
    const [initialPile] = initializePile();
    const [pile, setPile] = useState(initialPile);

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
            else {
                const color = parseInt(moveData[0].split('-')[0]);
                const startIndex = (color - 1) * 2;
                const colorArrays = [simulatedBoard[2][startIndex], simulatedBoard[2][startIndex + 1]];
                let targetArrayIndex = -1;

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
        moveReducer(board,simulatedBoard);
        const endLocations = getTileLocationsFromBoard(simulatedBoard);
        const unorderedTileMovements = getTileMovements(startLocations, endLocations);
        const openTile = findOpenSpot(board,simulatedBoard);
        const orderedtileMovements = reorderTileMovements(unorderedTileMovements,openTile);
        const tileMovements = orderedtileMovements.filter(move =>
            !move.from.startsWith('cpuhand') || tilesFromHand.includes(move.tile)
        );
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
                playPlaceSound() //this place audio is 0.41 seconds so the animation needs to be longer for the audio to not bug out
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

    const drawTile = (index) => {
        if (index === 3) {
            setBoard(boardSnapshot );
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

            playPlaceSound()
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
    const incrementGamesStarted = () => {
        let gamesStarted = parseInt(localStorage.getItem('gamesStarted') || '0', 10);
        gamesStarted += 1;
        localStorage.setItem('gamesStarted', gamesStarted);
    };

    const handleStartGame = () => {
        localStorage.removeItem("thinkTime");
        localStorage.removeItem(`playerStats_${localStorage.getItem("username")}`);
        incrementGamesStarted()
        setPlayerWon(false)
        setPlayerLose(false)
        setGameStarted(true)
        setStartTurnTime(performance.now())
        setStartGameTime(performance.now())

        const requestFullscreen = (element) => {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        };
        if (document.documentElement) {
            requestFullscreen(document.documentElement);
        }

    };

    const endGame = (playerScoreValue, cpuScoreValue) => {
        const endTime = performance.now();
        const gameDurationSeconds = ((endTime - state.startGameTime) / 1000).toFixed(2);

        let totalGameTime = JSON.parse(localStorage.getItem('totalGameTime')) || [];
        totalGameTime.push(parseFloat(gameDurationSeconds));
        localStorage.setItem('totalGameTime', JSON.stringify(totalGameTime));

        let totalGameScore = JSON.parse(localStorage.getItem('totalGameScore')) || [];
        totalGameScore.push({ player: playerScoreValue, cpu: cpuScoreValue });
        localStorage.setItem('totalGameScore', JSON.stringify(totalGameScore));
    };

    const handleWin = () => {
        setPlayerWon(true);
        incrementGamesCompleted();
        const cpuScoreValue = calculateCpuScore();
        const playerScoreValue = calculatePlayerScore();
        setCpuScore(cpuScoreValue);
        setPlayerScore(playerScoreValue);
        endGame(playerScoreValue, cpuScoreValue);
    };

    const handleLose = () => {
        setPlayerLose(true);
        incrementGamesCompleted();
        const playerScoreValue = calculatePlayerScore();
        const cpuScoreValue = calculateCpuScore();
        setPlayerScore(playerScoreValue);
        setCpuScore(cpuScoreValue);
        endGame(playerScoreValue, cpuScoreValue);
    };

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
                    score += 30; //penalty for a joker left in hand
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
                    score += 30; // penalty for a joker left in hand
                }

            }
        }
        return score;
    };

    return {
        boardSnapshot,
        setSeed,
        msgNotif,
        showNotif,
        playersTurn,
        playerWon,
        playerLose,
        firstTurn,
        cpuFirstTurn,
        gameStarted,
        hasPlayed,
        drawPending,
        drawIndex,
        startTurnTime,
        setPlayersTurn,
        setStartTurnTime,
        setStartGameTime,
        setHasPlayed,
        setBoardSnapshot,
        setMsgNotif,
        setShowNotif,
        setFirstTurn,
        setDrawPending,
        setCpuFirstTurn,
        setDrawIndex,
        board,
        setBoard,
        firstTurnBoard,
        setFirstTurnBoard,
        pile,
        setPile,
        initializeBoard,
        updateBoardTile,
        removeFromHand,
        getBoardValue,
        cpuMove,
        drawTile,
        actuallyDrawTile,
        onDragStart,
        handleStartGame,
        handleWin,
        handleLose,
        incrementGamesStarted
    };
}