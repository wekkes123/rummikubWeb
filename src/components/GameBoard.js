import React from 'react';
import BoardSpace from './BoardSpace';
import Tile from './Tile';

const GameBoard = ({ boardState, moveTile, isDraggingEnabled }) => {
    return (
        <div className="game-board">
            {boardState.map((row, y) => (
                <div key={y} className="board-row">
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
                                    value={cell.value}
                                    color={cell.color}
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
