import React, {useEffect} from 'react';
import { DndProvider} from "react-dnd";
import { TouchBackend } from 'react-dnd-touch-backend';
import { useNavigate } from 'react-router-dom';
import {t} from "i18next";
import {Button} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

import ComputerRack from '../components/ComputerRack';
import GameBoard from '../components/GameBoard';
import PlayerRack from '../components/PlayerRack';
import GameControls from '../components/GameControls';
import StartScreen from '../components/StartScreen';
import CustomDragLayer from '../dragDrop/CustomDragLayer';
import Notification from '../components/Notification'
import GameEndScreen from "../components/WinScreen";

import { validateBoard, playedTiles, findJokerValue } from "../components/Functions/gamePlayFunctions";

import {saveTime, recordMove} from "../components/Functions/gameplayMetrics";
import {useGameLogic} from "../components/Functions/useGameLogic";

import '../App.css';
import '../css/style.css'

const DEFAULT_BG_COLOR = '#35654D';
const backendForDND = TouchBackend;
const backendOptions = { enableMouseEvents: true };


/**
 * handels functionality from the game page and also the visuals
 * @returns {*}
 * @constructor
 */
function Game() {
    const {
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
        setStartTurnTime,
        setStartGameTime,
        setBoardSnapshot,
        setHasPlayed,
        setMsgNotif,
        setShowNotif,
        setFirstTurn,
        setDrawPending,
        setCpuFirstTurn,
        setPlayersTurn,
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
    } = useGameLogic();
    const navigate = useNavigate();

    //get the stored seed
    useEffect(()=>{
        let savedSeed = localStorage.getItem('seed');
        if (!savedSeed) {
            savedSeed = 'default_seed';
            localStorage.setItem('seed', savedSeed);
        }
        if (savedSeed) setSeed(savedSeed);
    })

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

            //and tiles for the cpu
            for (let i = 0; i < 14; i++) {
                newCpuHand.push(newPile.pop());
            }

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
    }, [playersTurn]);

    useEffect(() => {
        if (playersTurn === true) {//this is needed because otherwise the snapshot is taken before everything is properly initialised
            setStartTurnTime(performance.now())
            if(!firstTurn){
                setHasPlayed(false)
                saveToSnapshot()
            }
        }
    }, [playersTurn]);

    useEffect(() => {
        if (playersTurn === false) {
            setHasPlayed(false)
            setFirstTurnBoard(initializeBoard())
            cpuMove();
        }
    }, [playersTurn]);

    useEffect(() => {
        if (playersTurn === true && gameStarted === true) {
            setHasPlayed(true)
        }
    }, [firstTurnBoard]);

    useEffect(() => {
        console.log(hasPlayed);
    }, [hasPlayed]);

    useEffect(() => {
        console.log("started timer", startTurnTime)
    }, [startTurnTime]);


    const handleBack = () => navigate('/');


    const onDone = () => {
        const endTurnTime = performance.now();
        //step 1 is the board correct?
        if(!validateBoard(board)){
            console.log("board isnt correct")
            setMsgNotif(t("The board is not correct"))
            setShowNotif(true)
            recordMove({successfulMove: false, drewFromPile: false});
            return;
        }

        const playedtiles = playedTiles(boardSnapshot [3],board[3]);//step 2 did the player put down a tile?
        console.log(playedtiles)
        if(playedtiles.length === 0){
            setMsgNotif(t("You Have to place or draw a tile!"));
            setShowNotif(true)
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
                setShowNotif(true)
                console.log("less than 30 on first turn")
                recordMove({successfulMove: false, drewFromPile: false});
                return;
            } else {
                if(!validateBoard(firstTurnBoard)){
                    console.log("You used other players' tile to get to 30")
                    setMsgNotif(t("30other-notify"))
                    setShowNotif(true)
                    recordMove({successfulMove: false, drewFromPile: false});
                    return;
                }
                setFirstTurn(false)
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
        const FirstTurn = JSON.parse(localStorage.getItem("firstTurn"));
        const CpuFirstTurn = JSON.parse(localStorage.getItem("cpuFirstTurn"));
        const pile = JSON.parse(localStorage.getItem("pile"));
        setStartGameTime(performance.now())

        if (snapshot && pile !== null && FirstTurn !== null && CpuFirstTurn !== null) {
            setBoard(snapshot);
            setBoardSnapshot(snapshot);
            setFirstTurn(FirstTurn)
            setCpuFirstTurn(CpuFirstTurn)
            setPile(pile);
            incrementGamesStarted()
        } else {
            handleStartGame()
            setMsgNotif("Something went wrong while loading the previous game, we have started a new one")
            setMsgNotif(true)
            return;
        }
        handleStartGame();
    };

    const restoreFromSnapshot = () => {
        const restoredBoard = boardSnapshot.map(section =>
            section.map(group =>
                Array.isArray(group) ? [...group] : group
            )
        );
        setFirstTurnBoard(initializeBoard())
        setBoard(restoredBoard);
    };

    useEffect(() => {
        if (drawPending && drawIndex !== null) {
            actuallyDrawTile(drawIndex, board);
            setDrawIndex(null)
            setDrawPending(false)
        }
    }, [drawPending, drawIndex, board]);


    return (
        <DndProvider backend={backendForDND} options={backendOptions}>
            <div className="app" style={{background: DEFAULT_BG_COLOR}}>
                <CustomDragLayer  />

                <Notification message={msgNotif} isVisible={showNotif} onClose={() => setShowNotif( false)}/>
                <div id="tile-overlay-root"></div>
                <div className={`game-container ${!gameStarted || playerWon ? 'blurred' : ''}`} style={{background: DEFAULT_BG_COLOR}}>
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
                        setBoard={setBoard}
                        setFirstTurnBoard={setFirstTurnBoard}
                        getBoardValue={getBoardValue}
                        tilesAreDraggable={playersTurn}
                    />
                    <GameControls
                        onDraw={drawTile}
                        onDone={onDone}
                        onReverse={restoreFromSnapshot}
                        pressable={playersTurn}
                        hasPlayed={hasPlayed}
                    />
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        style={{
                            background: '#FFB703',
                            padding: "10px",
                            border: "1px solid black",
                            borderRadius: 0,
                            position: 'absolute',
                            color: 'black',
                            top: 20,
                            right: 20,
                            zIndex: 1,
                            fontWeight: 'bold'
                        }}
                    >
                        {t('back')}
                    </Button>
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