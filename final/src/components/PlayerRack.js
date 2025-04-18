import React from 'react';
import DraggableTile from '../dragDrop/DraggableTile';
import Tile from './Tile';
import DropZone from '../dragDrop/DropZone';
import {isTileMoveValid} from "./Functions/gamePlayFunctions";

function PlayerRack({ playerhand, onDragEnd, tilesAreDraggable = true, updatePlayerHand, updateBoardTile, getBoardValue }) {
    const handleTileDrop = (draggedTileData, dropData) => {
        const tileId = `${draggedTileData.color}-${draggedTileData.number}`;/*
        if(draggedTileData.location.startsWith("hand") && dropData.type === "hand"){
            console.log('Tile dropped in player rack:', draggedTileData, dropData);
            const [, handIndex] = draggedTileData.location.split('-').map(Number);
            console.log('handIndex', handIndex);
            const dropTile = getBoardValue(3,draggedTileData.handIndex,-1)
            updateBoardTile(
                3,
                dropData.handIndex,
                0,
                tileId,
            );
            updateBoardTile(
                3,
                handIndex,
                0,
                dropTile,
            );
        }*/
    };

    const handleTileDragEnd = (item) => {
        console.log("Tile drag ended without successful drop:", item);
        if (onDragEnd) {
            onDragEnd(item);
        }
    };

    return (
        <div className="container3">
            <div className="player-rack">
                {playerhand.map((tile, index) => {
                    let tileProps;

                    if (tile === 'empty') {
                        tileProps = {
                            key: `${tile}-${index}`,
                            id: tile,
                            color: 'empty',
                            number: 'empty',
                            isHighlighted: 0,
                            isGreyedOut: true,
                            location: `hand-${index}`
                        };
                    } else {
                        console.log(tile);
                        const [color, number] = tile.split('-');

                        tileProps = {
                            key: `${tile}-${index}`,
                            id: tile,
                            color: color,
                            number: number,
                            isHighlighted: 1,
                            location: `hand-${index}`,
                            curlo: tile.curlo
                        };
                    }
                    const draggable = tilesAreDraggable && tile !== 'empty';

                    return (
                        <DropZone
                            key={`hand-${index}`}
                            className="tile-drop-zone"
                            dropData={{
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