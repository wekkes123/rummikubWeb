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
import { isValidGroup,isValidRun, validateBoard, playedTiles, findJokerValue} from "./components/Functions/gamePlayFunctions";
import { getBestMove } from "./components/cpu/rummikubAPI"
import Notification from './components/Notification'
import {flyTileBetweenContainers} from "./components/Functions/TileMover";
import './App.css';
import './css/style.css'


const backendForDND = TouchBackend;
const backendOptions = { enableMouseEvents: true };

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [firstTurn, setFirstTurn] = useState(true);
  const [cpuFirstTurn, setCpuFirstTurn] = useState(true);
  const [boardSnapshot, setBoardSnapshot] = useState(null);
  const [playersTurn, setPlayersTurn] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
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
    let joker = null;

    if (Math.random() < 0.5) {
      pile.push('1-j');
      joker = '1-j';
    } else {
      pile.push('4-j');
      joker = '4-j';
    }

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
    if (pile.length === 105) {
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

      //newPlayerHand.push('1-j'); //todo remove this line
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
    if (playersTurn === true) {//this is needed because otherwise the snapshot is taken before everything is properly initialised
      if(!firstTurn){
        setHasPlayed(false);
        saveToSnapshot()
      }
    }
  }, [playersTurn]);

  useEffect(() => {
    if (playersTurn === false) {
      cpuMove();
    }
  }, [playersTurn]);



  const updateBoardTile = (section, groupIndex, tileIndex, value, add = null) => {
    setHasPlayed(true);
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

  const updateBoardTileWithAnimation = async (tile, fromElem, toElem) => {
    if (fromElem && toElem) {
      await new Promise(resolve =>
          flyTileBetweenContainers({
            tile,
            fromElem,
            toElem,
            onComplete: resolve
          })
      );
    }
  };


  const printB = () => {
    console.log(firstTurnBoard);
    console.log(board);
  };

  const removeFromHand = (sectionIndex, handIndex) => {
    const newBoard = [...board];
    const hand = newBoard[sectionIndex];
    hand.splice(handIndex, 1);
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
        console.log("CPU will play:", bestMove);
        playCpuMove(bestMove.setsToMake, bestMove.tilesToPlay, bestMove.jokerValue);
        setCpuFirstTurn(false);
        setPlayersTurn(true);
      } else {
        drawTile(4);
        console.log("CPU has no valid move");
      }
    } catch (error) {
      console.error("Error during CPU move:", error);
    }
  };
  const isJoker = (tile) => tile && tile.endsWith('-j');

  const playCpuMove = async (moves, tilesFromHand, jokerValue) => {
    let newBoard = [...board];
    const startLocations = getTileLocationsFromBoard(board);

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const type = move[0];

      const jokerTilesInHand = board[4].filter(isJoker);
      let usedJokers = 0;
      const moveData = move.slice(1).map(item => {
        if (item === 'j') {
          const jokerTile = jokerTilesInHand[usedJokers++];
          return jokerTile;
        }
        return item;
      });

      if (type === 'g') {
        if (moveData.length === 3) moveData.push('0');

        outerLoop: for (let j = 0; j < newBoard.length; j++) {
          for (let k = 0; k < newBoard[j].length; k++) {
            if (Array.isArray(newBoard[j][k]) && newBoard[j][k].every(item => item === '0')) {
              const boardCopy = structuredClone(newBoard);

              moveData.forEach((tile, m) => {
                if (tile !== '0') {
                  boardCopy[j][k][m] = tile;

                  const indexToRemove = boardCopy[4].indexOf(tile);
                  if (indexToRemove !== -1) {
                    boardCopy[4].splice(indexToRemove, 1);
                  }
                }
              });

              newBoard = boardCopy;
              break outerLoop;
            }
          }
        }
      } else {
        const color = parseInt(moveData[0].split('-')[0]);
        const startIndex = (color - 1) * 2;
        const colorArrays = [newBoard[2][startIndex], newBoard[2][startIndex + 1]];
        let targetArrayIndex = -1;

        for (let arrayIndex = 0; arrayIndex < colorArrays.length; arrayIndex++) {
          const currentArray = colorArrays[arrayIndex];
          let canFit = true;

          for (const tile of moveData) {
            const [, tileNumber] = tile?.split('-') || [];
            const index = isJoker(tile) ? jokerValue - 1 : parseInt(tileNumber) - 1;

            if (!currentArray || currentArray[index] === '1' || currentArray[index] === 1) {
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
          const boardCopy = structuredClone(newBoard);

          for (const tile of moveData) {
            const [, tileNumber] = tile?.split('-') || [];
            const index = isJoker(tile) ? jokerValue - 1 : parseInt(tileNumber) - 1;

            boardCopy[2][startIndex + targetArrayIndex][index] = tile;

            const indexToRemove = boardCopy[4].indexOf(tile);
            if (indexToRemove !== -1) {
              boardCopy[4].splice(indexToRemove, 1);
            }
          }

          newBoard = boardCopy;
        }
      }
    }

    const endLocations = getTileLocationsFromBoard(newBoard);
    const tileMovements = getTileMovements(startLocations, endLocations);

    let currentBoard = structuredClone(board);

    for (const move of tileMovements) {
      const { tile, from, to } = move;

      if (!tile || !from || !to) {
        console.warn("Skipping invalid tile movement", move);
        continue;
      }

      const fromElem = document.querySelector(`[data-location="${from}"]`)
          || document.querySelector('.computer-rack');
      const toElem = document.querySelector(`[data-location="${to}"]`);

      if (fromElem && toElem) {
        await updateBoardTileWithAnimation(tile, fromElem, toElem);
      } else {
        console.warn("Missing element for tile animation", { tile, from, to });
      }

      const fromLoc = getTileLocationParts(from);
      const toLoc = getTileLocationParts(to);

      // Safely update the board
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
      }

      setBoard(structuredClone(currentBoard));
      console.log('Updated board:', currentBoard);
    }
  };



  const getTileLocationsFromBoard = (board) => {
    const tileLocations = [];

    // Runs (board[2])
    board[2].forEach((runArray, runIndex) => {
      runArray.forEach((tile, tileIndex) => {
        if (tile && tile !== 0 && tile !== '0' && tile !== 1) {
          tileLocations.push([tile, `run-${runIndex}-${tileIndex}`]);
        }
      });
    });

    // Groups (board[0] and board[1])
    for (let sectionIndex = 0; sectionIndex <= 1; sectionIndex++) {
      board[sectionIndex].forEach((group, groupIndex) => {
        group.forEach((tile, tileIndex) => {
          if (tile && tile !== '0') {
            tileLocations.push([tile, `group-${sectionIndex}-${groupIndex}-${tileIndex}`]);
          }
        });
      });
    }

    // CPU hand (board[4])
    board[4].forEach((tile, index) => {
      if (tile && tile !== '0') {
        tileLocations.push([tile, `cpuhand-${index}`]);
      }
    });

    return tileLocations;
  };

  function getTileLocationParts(location) {
    if (location.startsWith('group-')) {
      const [, sectionIndex, groupIndex, tileIndex] = location.split('-').map((val, i) => i === 0 ? val : Number(val));
      return { type: 'group', sectionIndex, groupIndex, tileIndex };
    } else if (location.startsWith('run-')) {
      const [, runIndex, tileIndex] = location.split('-').map((val, i) => i === 0 ? val : Number(val));
      return { type: 'run', runIndex, tileIndex };
    } else if (location.startsWith('cpuhand-')) {
      const [, index] = location.split('-').map((val, i) => i === 0 ? val : Number(val));
      return { type: 'cpuhand', index };
    }
    return { type: 'unknown' };
  }

  const getTileMovements = (start, end) => {
    const movements = [];
    const startMap = new Map(start.map(([tile, loc]) => [tile, loc]));
    const endMap = new Map(end.map(([tile, loc]) => [tile, loc]));

    endMap.forEach((endLoc, tile) => {
      const startLoc = startMap.get(tile);
      if (startLoc && endLoc && startLoc !== endLoc && !(startLoc.startsWith('cpuhand-') && endLoc.startsWith('cpuhand-'))) {
        movements.push({ tile, from: startLoc, to: endLoc });
      }
    });

    return movements;
  };



  const onDone = () => {
    //step 1 is the board correct?
    if(!validateBoard(board)){
      console.log("board isnt correct")
      setMsgNotif("The board is not correct")
      setShowNotif(true);
      return;
    }
    const playedtiles = playedTiles(boardSnapshot[3],board[3]);//step 2 did the player put down a tile?
    if(playedtiles.length === 0){
      return;
      //todo notify the player that they have to play a tile or draw a tile
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
        setMsgNotif("You played less than 30 on your first turn")
        setShowNotif(true);
        console.log("less than 30 on first turn")
        return;
        //todo notify player of less then 30 also logic is not checking if tiles are using cpu's tiles
      } else {
        if(!validateBoard(firstTurnBoard)){
          console.log("used other players' tile to get to 30")
          setMsgNotif("You used other players' tile to get to 30")
          setShowNotif(true);
          //todo notify the player that they used the other players' tiles to get 30
        }
        //if the code gets here, the user passed all first turn rules
        setFirstTurn(false);
      }
    }
    //is their hand empty? -> win
    //else:
    console.log("ending turn");
    setPlayersTurn(false);
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
    restoreFromSnapshot();// drawing a tile means they should nt have played any tiles or changed to board
    const newPile = [...pile];
    const newHand = [...board[index]];

    newHand.push(newPile.pop());

    const newBoard = [...board];
    newBoard[index] = newHand;
    setBoard(newBoard);
    setPile(newPile);
    //end the turn of the cpu or the player
    setPlayersTurn(!playersTurn)
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

  return (
      <DndProvider backend={backendForDND} options={backendOptions}>
        <div className="app">
          <CustomDragLayer />

          <Notification message={msgNotif} isVisible={showNotif} onClose={() => setShowNotif(false)}/>
          <div id="tile-overlay-root"></div>
          <div className={`game-container ${!gameStarted || playerWon ? 'blurred' : ''}`}>
              <ComputerRack cpuhand={board[4]}/>
              <GameBoard
                  board={board}
                  updateBoardTile={updateBoardTile}
                  removeFromHand={removeFromHand}
                  getBoardValue={getBoardValue}
                  tilesAreDraggable={playersTurn}
                  firstTurn={firstTurn}
              />
                <PlayerRack
                    playerhand={board[3]}
                    onDragEnd={handleDragEnd}
                    tilesAreDraggable={playersTurn}
                />
                    <GameControls
                        onDraw={drawTile}
                        onDone={onDone}
                        onReverse={printB}
                        pressable={playersTurn}
                        hasPlayed={hasPlayed}
                    />
          </div>
          {!gameStarted && <StartScreen onStart={handleStartGame}/>}
        </div>
      </DndProvider>
  );
}

export default App;