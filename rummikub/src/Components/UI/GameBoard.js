import React, { useEffect, useRef, useState } from 'react';
import BoardSpace from './BoardSpace';
import Tile from './Tile';
import isValidMove from '../Logic/MoveValidator';

const GameBoard = ({ boardState, moveTile, isDraggingEnabled }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const initialized = useRef(false);
    const [width, setWidth] = useState(8);
    const [height, setHeight] = useState(3);
    const [legalGroups, setLegalGroups] = useState([]);

    useEffect(() => {
        const detectLegalGroups = (boardState) => {
            const groups = [];
            const tiles = [];

            boardState.forEach(row => {
                row.forEach(cell => {
                    if (cell) tiles.push(cell);
                });
            });

            const currentGroup = [];
            for (const tile of tiles) {
                currentGroup.push(tile);

                if (isValidMove(currentGroup)) {
                    groups.push([...currentGroup]);
                    currentGroup.length = 0;
                }
            }

            if (currentGroup.length > 0 && isValidMove(currentGroup)) {
                groups.push(currentGroup);
            }

            setLegalGroups(groups);
            console.log("detectLegalGroups: ", groups);
        };

        detectLegalGroups(boardState);
    }, [boardState]);

    useEffect(() => {
        calculateTileSize();
    }, [width, height]);

    useEffect(() => {
        const updateDimensions = () => {
            const boardWidth = window.innerWidth * 0.8;
            const boardHeight = window.innerHeight * 0.6;
            setDimensions({ width: boardWidth, height: boardHeight });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    useEffect(() => {
        if (!initialized.current && dimensions.width > 0 && dimensions.height > 0) {
            initialized.current = true;
            initializeGameBoard();
        }
    }, [dimensions]);

    const initializeGameBoard = () => {
        const availableWidth = dimensions.width;
        const availableHeight = dimensions.height;
        setWidth(Math.floor(availableWidth / 60));
        setHeight(Math.floor(availableHeight / 80));
    };

    const calculateTileSize = () => {
        if (dimensions.width === 0 || dimensions.height === 0) return { width: 0, height: 0 };

        const availableWidth = dimensions.width - (20 * (width - 1));
        const availableHeight = dimensions.height - (20 * (height - 1));

        const spaceWidth = availableWidth / width;
        const spaceHeight = availableHeight / height;

        let tileWidth = spaceHeight * 0.7;

        if (tileWidth > spaceWidth) {
            tileWidth = spaceWidth;
        }

        const tileHeight = tileWidth / 0.7;

        return {
            spaceWidth: Math.min(spaceWidth, tileWidth * 1.1, 40),
            spaceHeight: Math.min(spaceHeight, tileHeight * 1.1, 60),
            tileWidth,
            tileHeight
        };
    };

    const sizes = calculateTileSize();

    const positionGroups = () => {
        const middleX = Math.floor(width / 2);
        const middleY = Math.floor(height / 2);

        let xOffset = middleX - Math.floor(legalGroups.length / 2);
        let yOffset = middleY;

        legalGroups.forEach(group => {
            group.forEach((tile, index) => {
                const x = (xOffset + index) % width;
                const y = (yOffset + Math.floor((xOffset + index) / width)) % height;
            });
            xOffset += group.length + 1;
        });
    };

    useEffect(() => {
        if (legalGroups.length > 0) {
            positionGroups();  // Update positions when legal groups change
        }
    }, [legalGroups]);  // Trigger whenever legalGroups change

    return (
        <div className="game-board-container" style={{
            width: '80%',
            height: '60vh',
            backgroundColor: '#58B4D1',
            borderRadius: '8px',
        }}>
            <div className="game-board" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: 'fit-content',
                margin: '0 auto'
            }}>
                {Array(height).fill().map((_, y) => (
                    <div key={y} className="board-row" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                    }}>
                        {Array(width).fill().map((_, x) => {
                            const cell = boardState[y] && boardState[y][x] ? boardState[y][x] : null;

                            return (
                                <div
                                    key={`${x}-${y}`}
                                    style={{
                                        width: sizes.spaceWidth + 'px',
                                        height: sizes.spaceHeight + 'px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <BoardSpace
                                        x={x}
                                        y={y}
                                        moveTile={moveTile}
                                        isDraggingEnabled={isDraggingEnabled}
                                        width={sizes.spaceWidth}
                                        height={sizes.spaceHeight}
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
                                                width={sizes.tileWidth}
                                                height={sizes.tileHeight}
                                            />
                                        )}
                                    </BoardSpace>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
