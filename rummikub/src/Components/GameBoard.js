import React from 'react';
import BoardSpace from './BoardSpace';
import Tile from './Tile';

const GameBoard = ({ boardState, moveTile, isDraggingEnabled }) => {
    const boardSize = boardState.length;

    return (
        <div className="game-board" style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`, // Set columns dynamically based on the board size
            gridTemplateRows: `repeat(${boardSize}, 1fr)` // Set rows dynamically based on the board size
        }}>
            {boardState.map((row, y) => (
                <div key={y} className="board-row" style={{ display: 'flex' }}>
                    {row.map((cell, x) => (
                        <BoardSpace
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            moveTile={moveTile}
                            isDraggingEnabled={isDraggingEnabled}
                        >
                            {cell && (
                                <Tile
                                    id={cell.id}
                                    color={cell.color}
                                    value={cell.value}
                                    location="board"
                                    position={{ x, y }}
                                    moveTile={moveTile}
                                    isDraggingEnabled={isDraggingEnabled}
                                />
                            )}
                        </BoardSpace>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
