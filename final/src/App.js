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
import './App.css';
import './css/style.css'


//sommige functies die doorgepast wrden naar andere components worden insta geexecute, fix dit

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
        saveToSnapshot()
      }
    }
  }, [playersTurn]);

  useEffect(() => {
    if (playersTurn === false) {
      //todo Add logic for when it's not the player's turn
      console.log("It's NOT the player's turn");
      cpuMove();
    }
  }, [playersTurn]);



  const updateBoardTile = (section, groupIndex, tileIndex, value, add = null) => {
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
        playCpuMove(bestMove.setsToMake, bestMove.tilesToPlay);
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

  const playCpuMove = (moves, tilesFromHand) => {
    let newBoard;
    if(cpuFirstTurn){
      newBoard = [...board];
    } else {
      newBoard = initializeBoard();
      newBoard[3] = board[3];
      newBoard[4] = board[4];
    }

    // Remove tiles from hand of the cpu
    const updatedTilesInHand = [...newBoard[4]];
    for (const tile of tilesFromHand) {
      if (tile === 'j') {
        const indexToRemove = updatedTilesInHand.findIndex(
            boardTile => boardTile === '1-j' || boardTile === '4-j'
        );
        if (indexToRemove !== -1) {
          updatedTilesInHand.splice(indexToRemove, 1);
        }
      } else {
        const indexToRemove = updatedTilesInHand.indexOf(tile);
        if (indexToRemove !== -1) {
          updatedTilesInHand.splice(indexToRemove, 1);
        }
      }
    }
    newBoard[4] = updatedTilesInHand;



    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const type = move[0];

      //api returns "j" as joker so we rist have to replace it here with our joker
      const moveData = [...move.slice(1)].map(item => item === 'j' ? joker : item);

      if (type === 'g') { // group
        if (moveData.length === 3) {
          moveData.push('0');
        }
        outerLoop: for (let j = 0; j < newBoard.length; j++) {
          for (let k = 0; k < newBoard[j].length; k++) {
            if (Array.isArray(newBoard[j][k]) &&
                newBoard[j][k].every(item => item === '0')) {
              newBoard[j][k] = moveData;
              break outerLoop;
            }
          }
        }
      } else {
        // Process run move
        const color = parseInt(moveData[0].split('-')[0]);
        // Determine which arrays correspond to this color
        // Each color has 2 arrays in newBoard[2]
        const startIndex = (color - 1) * 2;
        const colorArrays = [newBoard[2][startIndex], newBoard[2][startIndex + 1]];
        console.log(color);
        // Check which of the two arrays has space for all tiles
        let targetArrayIndex = -1;

        // Check both arrays for the color to see which one can fit all the tiles
        for (let arrayIndex = 0; arrayIndex < 2; arrayIndex++) {
          const currentArray = colorArrays[arrayIndex];
          let canFit = true;

          for (const tile of moveData) {
            const [, tileNumber] = tile.split('-');
            const index = parseInt(tileNumber) - 1;

            // If the tile is already used, this array can't fit the run
            if (currentArray[index] === '1') {
              canFit = false;
              break;
            }
          }

          if (canFit) {
            targetArrayIndex = arrayIndex;
            break;
          }
        }

        // If we found an array that can fit the run
        if (targetArrayIndex !== -1) {
          const targetArray = colorArrays[targetArrayIndex];

          // Place each tile in the run
          for (const tile of moveData) {
            const [, tileNumber] = tile.split('-');
            const index = parseInt(tileNumber) - 1;
            targetArray[index] = 1;
          }

          // Update the array in newBoard
          newBoard[2][startIndex + targetArrayIndex] = targetArray;
        }
      }
    }

    setBoard(newBoard);
  };

  const onDone = () => {
    //step 1 is the board correct?
    if(!validateBoard(board)){
      console.log("board isnt correct")
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
        return;
        //todo notify player of less then 30 also logic is not checking if tiles are using cpu's tiles
      } else {
        if(!validateBoard(firstTurnBoard)){
          console.log("used other players' tile to get to 30")
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
          <div className={`game-container ${!gameStarted || playerWon ? 'blurred' : ''}`}>
            {/*<ComputerRack tileCount={computerTileCount} />*/}
            <GameBoard
                board={board}
                updateBoardTile={updateBoardTile}
                removeFromHand = {removeFromHand}
                getBoardValue={getBoardValue}
                tilesAreDraggable={playersTurn}
                firstTurn = {firstTurn}
            />
            <GameControls
                onDraw = {drawTile}
                onDone = {onDone}
                onReverse = {printB}
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