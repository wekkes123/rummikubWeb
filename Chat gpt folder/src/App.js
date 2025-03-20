import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameBoard from './components/GameBoard';
import PlayerHand from './components/PlayerHand';
import TileData from './components/TileData';
import ImageGallery from './components/ImageGallery'; // Import your existing ImageGallery component
import './App.css';

// Main Game Component
const GameComponent = () => {
  // State for tiles in hand and on board
  const generateHandTiles = (count) => {
    const shuffledTiles = [...TileData].sort(() => Math.random() - 0.5); // Shuffle the tiles
    return shuffledTiles.slice(0, count).map((tile, index) => ({
      id: index + 1, // Generate unique ID
      color: tile.color,
      value: tile.value,
      image: tile.image,
    }));
  };

  const [handTiles, setHandTiles] = useState(generateHandTiles(60)); // Get 5 random tiles
  const [boardState, setBoardState] = useState(
      Array(5).fill().map(() => Array(5).fill(null))
  );

  // State for enabling/disabling drag functionality
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
  // A key to force DndProvider to remount
  const [dndKey, setDndKey] = useState(0);

  // Toggle drag functionality
  const toggleDragging = useCallback(() => {
    setIsDraggingEnabled(prev => !prev);
    // Increment the key to force DndProvider to remount
    setDndKey(prev => prev + 1);
  }, []);

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
      // Find the tile on the board
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

  return (
      <DndProvider backend={HTML5Backend} key={dndKey}>
        <div className="app">
          <h1>Rummikub drag test game</h1>
          <div className="nav-links">
            <Link to="/image">View Image Gallery</Link>
          </div>

          <div className="controls">
            <button
                className={`toggle-button ${isDraggingEnabled ? 'enabled' : 'disabled'}`}
                onClick={toggleDragging}
            >
              Dragging is {isDraggingEnabled ? 'Enabled' : 'Disabled'}
            </button>
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

// Main App Component with Router
const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<GameComponent />} />
          <Route path="/image" element={<ImageGallery />} />
        </Routes>
      </Router>
  );
};

export default App;