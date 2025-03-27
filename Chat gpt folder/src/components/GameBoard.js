import React, {useEffect, useRef, useState} from 'react';
import BoardSpace from './BoardSpace';
import Tile from './Tile';

const GameBoard = ({ boardState, moveTile, isDraggingEnabled }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const initialized = useRef(false);
    const [width, setWidth] = useState(8); // Initialize width to 8
    const [height, setHeight] = useState(3); // Initialize height to 3

    // Function to update width
    const updateWidth = (newWidth) => {
        setWidth(newWidth);
    };

    // Function to update height
    const updateHeight = (newHeight) => {
        setHeight(newHeight);
    };

    // Calculate dimensions on mount and window resize
    useEffect(() => {
        const updateDimensions = () => {
            const boardWidth = window.innerWidth * 0.8; // 80% of screen width
            const boardHeight = window.innerHeight * 0.6; // 60% of screen height
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
            initialized.current = true; // Mark as initialized
            initializeGameBoard();
        }
    }, [dimensions]);

    const initializeGameBoard = () => {
        const availableWidth = dimensions.width;
        const availableHeight = dimensions.height;
        setWidth(Math.floor(availableWidth / 100));
        setHeight(Math.floor(availableHeight / 127));
    };


    // Calculate the size for each tile space
    const calculateTileSize = () => {
        if (dimensions.width === 0 || dimensions.height === 0) return { width: 0, height: 0 };

        // Account for spacing between tiles (20px gap)
        const availableWidth = dimensions.width - (20 * (width - 1));
        const availableHeight = dimensions.height - (20 * (height - 1));

        // Calculate space dimensions based on available space and grid size
        const spaceWidth = availableWidth / width;
        const spaceHeight = availableHeight / height;

        // Correctly apply the 7:10 width to height ratio (width is 7/10 of height)
        // If width constrains, calculate height based on width
        // If height constrains, calculate width based on height

        // First, let's see if height constrains
        let tileWidth = spaceHeight * 0.7; // 7/10 of height

        // If calculated width exceeds available space width, then width constrains
        if (tileWidth > spaceWidth) {
            tileWidth = spaceWidth;
        }

        const tileHeight = tileWidth / 0.7; // Calculate height based on correct ratio

        return {
            spaceWidth: Math.min(spaceWidth, tileWidth * 1.1, 60), // Give some padding
            spaceHeight: Math.min(spaceHeight, tileHeight * 1.1, 87), // Give some padding
            tileWidth,
            tileHeight
        };
    };

    const sizes = calculateTileSize();

    return (
        <div className="game-board-container" style={{
            width: '80%',
            height: '60vh',
            padding: '20px',
            backgroundColor: '#58B4D1',
            borderRadius: '8px',
            margin: '0 auto', // Center the board
        }}>
            <div className="game-board" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px', // 20px gap between rows
                width: 'fit-content',
                margin: '0 auto' // Center the grid inside the container
            }}>
                {Array(height).fill().map((_, y) => (
                    <div key={y} className="board-row" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px', // 20px gap between columns
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