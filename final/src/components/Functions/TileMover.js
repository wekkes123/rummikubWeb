import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import React from 'react';
import Tile from '../Tile';

export function flyTileBetweenContainers({ tile, fromElem, toElem, onComplete = () => {} }) {
    const overlayContainer = document.getElementById('tile-overlay-root');
    if (!fromElem || !toElem || !overlayContainer) {
        console.warn('Could not find elements for animation');
        return;
    }

    const fromRect = fromElem.getBoundingClientRect();
    const toRect = toElem.getBoundingClientRect();
    const overlayRect = overlayContainer.getBoundingClientRect();

    const fromX = fromRect.left - overlayRect.left;
    const fromY = fromRect.top - overlayRect.top;
    const toX = toRect.left - overlayRect.left;
    const toY = toRect.top - overlayRect.top;

    const [color, number] = tile.split('-');

    const tileProps = {
        id: tile,
        color: color,
        number: number,
        isHighlighted: true,
        isGreyedOut: false,
        flash: false,
    };

    const flyingTileDiv = document.createElement('div');
    overlayContainer.appendChild(flyingTileDiv);
    const root = createRoot(flyingTileDiv);

    const tileComponent = (
        <motion.div
            initial={{ x: fromX, y: fromY }}
            animate={{ x: toX, y: toY }}
            transition={{ duration: 0.5, ease: 'easeInOut' }} //if you change the duration here, make sure to fix potential sound bugs
            onAnimationComplete={() => {
                root.unmount();
                overlayContainer.removeChild(flyingTileDiv);
                onComplete();
            }}
        >
            <Tile {...tileProps} />
        </motion.div>
    );
    root.render(tileComponent);
}

export function reorderTileMovements(movements, tempLocation) {
    console.log(movements)
    const remainingMoves = [...movements];
    const orderedMoves = [];

    const occupiedLocations = new Map();
    const originalLocations = new Map();

    remainingMoves.forEach(move => {
        occupiedLocations.set(move.from, move.tile);
        originalLocations.set(move.tile, move.from);
    });

    while (remainingMoves.length > 0) {
        let moveFound = false;
        for (let i = 0; i < remainingMoves.length; i++) {
            const move = remainingMoves[i];
            if (!occupiedLocations.has(move.to) ||
                !remainingMoves.some(m => m.from === move.to)) {

                orderedMoves.push(move);

                occupiedLocations.delete(move.from);
                occupiedLocations.set(move.to, move.tile);

                remainingMoves.splice(i, 1);
                moveFound = true;
                break;
            }
        }

        if (!moveFound && remainingMoves.length > 0) {
            const tempMove = remainingMoves[0];
            const placeholderMove = {
                tile: tempMove.tile,
                from: tempMove.from,
                to: tempLocation
            };
            orderedMoves.push(placeholderMove);

            occupiedLocations.delete(tempMove.from);
            occupiedLocations.set(tempLocation, tempMove.tile);

            tempMove.from = tempLocation;
        }
    }
    return orderedMoves;
}

// Example usage:
// const orderedMovements = reorderTileMovements(tileMovements, "group-0-0-2");

export function findOpenSpot(board, newBoard) {
    for (let sectionIndex = 1; sectionIndex >= 0; sectionIndex--) {
        const boardSection = board[sectionIndex];
        const newBoardSection = newBoard[sectionIndex];

        for (let i = 0; i < boardSection.length; i++) {
            for (let j = 0; j < boardSection[i].length; j++) {
                if (boardSection[i][j] === '0' && newBoardSection[i][j] === '0') {
                    return `group-${sectionIndex}-${i}-${j}`;
                }
            }
        }
    }
    return "group-0-0-0";
}

export function getTileLocationsFromBoard(board) {
    const tileLocations = [];

    // Runs (board[2])
    board[2].forEach((runArray, runIndex) => {
        runArray.forEach((tile, tileIndex) => {
            if (tile && tile !== 0 && tile !== '0') {
                if(tile === "1-j" || tile === "4-j"){
                    tileLocations.push([tile, `run-${runIndex}-${tileIndex}`]);
                } else {
                    tileLocations.push([`${Math.ceil((runIndex + 1) / 2)}-${tileIndex+1}`, `run-${runIndex}-${tileIndex}`]);
                }
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
}

export function getTileLocationParts(location) {
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

export function getTileMovements(start, end) {
    const movements = [];
    const startTiles = new Map();
    start.forEach(([tile, loc]) => {
        if (!startTiles.has(tile)) {
            startTiles.set(tile, []);
        }
        startTiles.get(tile).push(loc);
    });

    const processedInEnd = new Set();
    end.forEach(([tile, loc]) => {
        const key = `${tile}-${loc}`;
        if (processedInEnd.has(key)) return;
        processedInEnd.add(key);

        const startLocs = startTiles.get(tile) || [];

        for (let i = 0; i < startLocs.length; i++) {
            const startLoc = startLocs[i];

            if (startLoc === loc) continue;
            if (startLoc.startsWith('cpuhand-') && loc.startsWith('cpuhand-')) continue;

            movements.push({ tile, from: startLoc, to: loc });
            startLocs.splice(i, 1);
            break;
        }
    });
    return movements;
}