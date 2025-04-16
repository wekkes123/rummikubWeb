import React, { useState, useEffect } from 'react';
import ComputerRack from './components/ComputerRack';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider, Preview } from "react-dnd";
import { createSeededRNG, shuffleArray } from './components/Functions/SeededRNG'
import GameBoard from './components/GameBoard';
import PlayerRack from './components/PlayerRack';
import GameControls from './components/GameControls';
import WinScreen from './components/WinScreen';
import StartScreen from './components/StartScreen';
import CustomDragLayer from './dragDrop/CustomDragLayer';
import {isValidGroup,isValidRun, validateBoard, playedTiles, findJokerValue} from "./components/Functions/gamePlayFunctions";
import {flyTileBetweenContainers} from './components/Functions/TileMover';
import './App.css';
import './css/style.css'
import NotificationBanner from './components/Notification'

//sommige functies die doorgepast wrden naar andere components worden insta geexecute, fix dit

const backendForDND = TouchBackend;
const backendOptions = { enableMouseEvents: true };

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [firstTurn, setFirstTurn] = useState(true);
  const [boardSnapshot, setBoardSnapshot] = useState(null);
  const [playersTurn, setPlayersTurn] = useState(true);
  const [flashAllTiles, setFlashAllTiles] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [msgNotif, setMsgNotif] = useState("hello");

  const seed = 'ihvj';

  const initializeBoard = () => {
    const groups1 = Array(8).fill().map(() => Array(4).fill('0'));
    const groups2 = Array(8).fill().map(() => Array(4).fill('0'));
    const runs = Array(8).fill().map(() => Array(13).fill('0'));
    const playerhand = Array(14).fill('1-1');
    const cpuhand = Array(14).fill('1-1');

    return [groups1, groups2, runs, playerhand, cpuhand];
  };

  const initializePile = () => {
    let pile = [];

    pile.push('1-j');
    pile.push('4-j');
    //fill pouch with all tiles
    for (let k = 0; k < 2; k++) {
      for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 13; j++) {
          pile.push(`${i}-${j}`);
        }
      }
    }


    pile = shuffleArray(pile,createSeededRNG(seed));
    return pile;
  }

  //step 1 initialize the arrays
  const [board, setBoard] = useState(initializeBoard());
  const [firstTurnBoard, setFirstTurnBoard] = useState(initializeBoard());
  const [pile, setPile] = useState(initializePile());

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

      newPlayerHand.push('1-j'); //todo remove this line
      const newBoard = [...board];
      newBoard[3] = newPlayerHand;
      newBoard[4] = newCpuHand
      setBoard(newBoard);
      setPile(newPile);
      setBoardSnapshot(JSON.parse(JSON.stringify(newBoard))) //snapshot was taken before the game is done being initialized so for the beginning. json is a way to take a deep copy
    }
  }, [pile, board]);

  //step 3 main gameplay loop
  useEffect(() => {
    if (playersTurn === true) {
      if(!firstTurn){
        saveToSnapshot()
      }
    }
  }, [playersTurn]);

  useEffect(() => {
    if (playersTurn === false) {
      //todo Add logic for when it's not the player's turn
      setMsgNotif("Not your Turn")
      setShowNotif(true);
      console.log("It's NOT the player's turn");
    }
  }, [playersTurn]);



  const updateBoardTile = (section, groupIndex, tileIndex, value, add = 0) => {
    const updateBoardState = (prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[section] = [...newBoard[section]];
      newBoard[section][groupIndex] = [...newBoard[section][groupIndex]];
      newBoard[section][groupIndex][tileIndex] = value;
      return newBoard;
    };

    if (add) {
      setFirstTurnBoard(updateBoardState);
    }
    setBoard(updateBoardState);
  };


  const removeFromHand = (sectionIndex, handIndex) => {
    const newBoard = [...board];
    const hand = newBoard[sectionIndex];
    hand.splice(handIndex, 1);
    setBoard(newBoard);
  };

  const getBoardValue = (section, groupIndex, tileIndex) => {
    if(tileIndex === -1){
      return board[section][groupIndex];
    }
    return board[section][groupIndex][tileIndex];
  };

  const onDone = () => {
    console.log(firstTurnBoard);
    console.log(board);
    if(!validateBoard(board)){
      console.log("board isnt correct")
      return;
    }
    const playedtiles = playedTiles(boardSnapshot[3],board[3]);
    if(playedtiles.length === 0){
      setMsgNotif("Computers Turn")
      setShowNotif(true);
      return;
      //todo notify the player that they have to play a tile or draw a tile
    } else if(firstTurn){
      let count = 0;
      for(const tile of playedtiles){
        const [, number] = tile.split('-').map(Number)
        if (Number.isNaN(number)) {// .map tries to convert the number of the tile to a number, if its a joker -> convers to NaN
          console.log(findJokerValue(board,tile));
          count += findJokerValue(board,tile);
          continue;
        }
        count += number;
      }
      console.log(count);
      if (count < 30){
        setMsgNotif("You played less than 30 on your first turn")
        setShowNotif(true);
        console.log("less than 30 on first turn")
        setFlashAllTiles(true);
        setTimeout(() => setFlashAllTiles(false), 1500);
        return;
        //todo notify player of less then 30 also logic is not checking if tiles are using cpu's tiles
      } else {
        if(!validateBoard(firstTurnBoard)){
          console.log("used other players' tile to get to 30")
          //todo notify the player that they used the other players' tiles to get 30
        }
        setMsgNotif("Computers Turn")
        setShowNotif(true);
        //if the code gets here, the user passed all first turn rules
        setFirstTurn(false);
      }
    }
  }

  const saveToSnapshot = () => {
    console.log("snapshot taken")
    // takes a deep copy
    const snapshot = board.map(section =>
        section.map(group =>
            Array.isArray(group) ? [...group] : group
        )
    );
    setBoardSnapshot(snapshot);
  };

    const restoreFromSnapshot = () => {
    const restoredBoard = boardSnapshot.map(section =>
        section.map(group =>
            Array.isArray(group) ? [...group] : group
        )
    );
    setBoard(restoredBoard);
  };

  //index is used so you can use this function to add to the cpus hand index = 4 or the players hand index = 3
  const drawTile = (index) => {
    const newPile = [...pile];
    const newHand = [...board[index]];

    newHand.push(newPile.pop());

    const newBoard = [...board];
    newBoard[index] = newHand;
    setBoard(newBoard);
    setPile(newPile);
    setMsgNotif("computers Turn")
    setShowNotif(true);
    //end the turn of the cpu or the player
    //setPlayersTurn(!playersTurn)
  }

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleWin = () => {
    setPlayerWon(true);
  };

  // Handle failed drag operations
  const handleDragEnd = (item) => {
    console.log("Drag ended without successful drop for item:", item);
  };

  const handleTestMoveTile = () => {
    const cpuHand = board[4];
    if (cpuHand.length === 0) return;

    const tileToMove = cpuHand[0];
    const newBoard = [...board];

    const targetGroup = newBoard[0][0];
    const emptyIndex = targetGroup.findIndex(val => val === '0');

    if (emptyIndex === -1) {
      console.log("No space in group 0-0");
      return;
    }

    const fromElem = document.querySelector('.computer-rack');
    const toElem = document.querySelector(`[data-location="group-0-0-${emptyIndex}"]`);

    flyTileBetweenContainers({
      tile: tileToMove,
      fromElem,
      toElem,
      onComplete: () => updateBoardTile(0, 0, emptyIndex, tileToMove)
    });

    removeFromHand(4, 0);
  };


  return (
      <DndProvider backend={backendForDND} options={backendOptions}>
        <div className="app">

          <CustomDragLayer />

          <NotificationBanner message={msgNotif} isVisible={showNotif} onClose={() => setShowNotif(false)}/>
          <div id="tile-overlay-root"></div>
            <div className={`game-container ${!gameStarted || playerWon ? 'blurred' : ''}`}>
              <ComputerRack cpuhand={board[4]} />
              <GameBoard
                  board={board}
                  updateBoardTile={updateBoardTile}
                  removeFromHand = {removeFromHand}
                  getBoardValue={getBoardValue}
                  tilesAreDraggable={playersTurn}
                  firstTurn = {firstTurn}
                  flashAllTiles={flashAllTiles}
              />
              <GameControls
                  onDraw = {drawTile}
                  onDone = {onDone}
                  onReverse = {saveToSnapshot}
                  pressable = {playersTurn}
              />
              <PlayerRack
                  playerhand={board[3]}
                  onDragEnd={handleDragEnd}
                  tilesAreDraggable={playersTurn}
              />
            </div>

          {!gameStarted && <StartScreen onStart={handleStartGame} />}
        </div>
      </DndProvider>
  );
}

export default App;