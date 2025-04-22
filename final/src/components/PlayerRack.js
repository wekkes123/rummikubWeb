import React from 'react';
import DraggableTile from '../dragDrop/DraggableTile';
import Tile from './Tile';
import DropZone from '../dragDrop/DropZone';
import {isTileMoveValid, removeOriginalTile} from "./Functions/gamePlayFunctions";
const placeTileAudio = new Audio("/sounds/place.mp3");


function PlayerRack({ playerhand, onDragEnd, tilesAreDraggable = true, setBoard, board, getBoardValue, firstTurnBoard, setFirstTurnBoard}) {
    const handleTileDrop = (draggedTileData, dropData) => {
        const newBoard = [...board];
        const newFirstTurnBoard = [...firstTurnBoard];
        console.log('Tile dropped in player rack:', draggedTileData, dropData);
        const tileId = `${draggedTileData.color}-${draggedTileData.number}`;
        if(draggedTileData.location.startsWith("hand") && dropData.type === "hand"){
            const [,startHandIndex] = draggedTileData.location.split('-').map(Number);
            const dropTile = JSON.parse(JSON.stringify(newBoard[3][dropData.handIndex]));
            newBoard[3][dropData.handIndex] = tileId;
            newBoard[3][startHandIndex] = dropTile;
            setBoard(newBoard);
            placeTileAudio.play();
            return;
        }

        if(isTileMoveValid(draggedTileData, dropData, getBoardValue, firstTurnBoard) === '0'){
            return;
        }
        if (draggedTileData.location) {
            if (draggedTileData.location.startsWith('group-')) {
                const [, sourceSectionIndex, sourceGroupIndex, sourceTileIndex] = draggedTileData.location.split('-').map(Number);
                newBoard[sourceSectionIndex][sourceGroupIndex][sourceTileIndex] = '0';
                firstTurnBoard[sourceSectionIndex][sourceGroupIndex][sourceTileIndex] = '0'
            } else if (draggedTileData.location.startsWith('run-')) {
                const [, sourceRunIndex, sourceTileIndex] = draggedTileData.location.split('-').map(Number);
                newBoard[2][sourceRunIndex][sourceTileIndex] = '0';
                firstTurnBoard[2][sourceRunIndex][sourceTileIndex] = '0';
            }
        }
        if(dropData.type === "hand") {
            const playerHand = [...newBoard[3]];
            if(playerHand[dropData.handIndex] === 'empty') {
                playerHand[dropData.handIndex] = tileId;
            }
            else {
                let emptyIndex = playerHand.indexOf('empty');
                if (emptyIndex === -1) {
                    emptyIndex = playerHand.length;
                }
                for (let i = emptyIndex; i > dropData.handIndex; i--) {
                    playerHand[i] = playerHand[i - 1];
                }
                playerHand[dropData.handIndex] = tileId;
            }
            newBoard[3] = playerHand;
        }
        setBoard(newBoard);
        setFirstTurnBoard(firstTurnBoard);
        placeTileAudio.play();
    };

    const handleTileDragEnd = (item) => {
        if (onDragEnd) {
            onDragEnd(item);
        }
    };

    return (
        <div className="container3">
            <div className="player-rack">
                {playerhand.map((tile, index) => {
                    let tileProps;

                    if (!tile || tile === 'empty') {  // Add a check for undefined tiles
                        tileProps = {
                            key: `empty-${index}`,
                            id: 'empty',
                            color: 'empty',
                            number: 'empty',
                            isHighlighted: 0,
                            isGreyedOut: true,
                            location: `hand-${index}`
                        };
                    } else {
                        const [color, number] = tile.split('-');

                        tileProps = {
                            key: `${tile}-${index}`,
                            id: tile,
                            color: color,
                            number: number,
                            isHighlighted: 1,
                            location: `hand-${index}`,
                            handIndex: index  // Add this to track the index correctly
                        };
                    }
                    const draggable = tilesAreDraggable && tile !== 'empty' && tile !== undefined;

                    return (
                        <DropZone
                            key={`hand-${index}`}
                            className="tile-drop-zone"
                            dropData={{
                                sectionIndex: 3,
                                handIndex: index,
                                type: 'hand'
                            }}
                            onDrop={handleTileDrop}
                        >
                            {draggable ? (
                                <DraggableTile
                                    {...tileProps}
                                    onDragEnd={handleTileDragEnd}
                                />
                            ) : (
                                <Tile {...tileProps} />
                            )}
                        </DropZone>
                    );
                })}
            </div>
        </div>
    );
}

export default PlayerRack;