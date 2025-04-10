import React from 'react';
import DropZone from '../dragDrop/DropZone';
import Tile from './Tile';
import DraggableTile from '../dragDrop/DraggableTile';
import {isTileMoveValid, removeOriginalTile} from './Functions/gamePlayFunctions'

function RunsContainer({ runs, sectionIndex, updateBoardTile, tilesAreDraggable = true, getBoardValue, removeFromHand, firstTurn }) {

    const colors = ['1', '2', '3', '4'];

    const handleTileDrop = (draggedTileData, dropData) => {

        console.log('Tile dropped in run:', draggedTileData, dropData);


        if(isTileMoveValid(draggedTileData, dropData, getBoardValue) === '0'){
            return;
        }

        removeOriginalTile(draggedTileData, updateBoardTile, removeFromHand)

        if(draggedTileData.number === 'j'){
            updateBoardTile(
                2,
                dropData.runIndex,
                dropData.tileIndex,
                `${draggedTileData.color}-${draggedTileData.number}`,
                firstTurn
            );
        } else{
            updateBoardTile(
                2,
                dropData.runIndex,
                draggedTileData.number - 1,
                1,
                firstTurn
            );
        }

    };


    const handleTileDragEnd = (item) => {
        console.log("Tile drag ended without successful drop:", item);
    };

    return (
        <div className="runs">
            {runs.map((run, runIndex) => {
                const colorIndex = Math.floor(runIndex / 2);
                const color = colors[colorIndex];

                return (
                    <div key={`run-${runIndex}`} className="run">
                        {run.map((tileValue, tileIndex) => {
                            let number, isHighlighted, isGreyedOut,tileProps;
                            if (tileValue === '1-j' || tileValue === '4-j') {
                                isHighlighted = 1;
                                tileProps = {
                                    id: `run-${runIndex}-${tileIndex}`,
                                    color: tileValue.charAt(0),
                                    number: 'j',
                                    isHighlighted: isHighlighted,
                                    isGreyedOut: 0,
                                    location: `run-${runIndex}-${tileIndex}`,
                                    curlo: tileIndex
                                };
                            } else {
                                number = tileIndex + 1;
                                isHighlighted = tileValue === 1;
                                isGreyedOut = tileValue === 0;
                                tileProps = {
                                    id: `run-${runIndex}-${tileIndex}`,
                                    color: color,
                                    number: number,
                                    isHighlighted: isHighlighted,
                                    isGreyedOut: isGreyedOut,
                                    location: `run-${runIndex}-${tileIndex}`,
                                    curlo: tileIndex
                                };
                            }

                            // Whether to render tile as draggable or not
                            const shouldBeDraggable = tilesAreDraggable && isHighlighted;

                            return (
                                <DropZone
                                    key={`run-${runIndex}-${tileIndex}`}
                                    className="tile-drop-zone"
                                    dropData={{
                                        sectionIndex,
                                        runIndex,
                                        tileIndex,
                                        type: 'run'
                                    }}
                                    onDrop={handleTileDrop}
                                >
                                    {shouldBeDraggable ? (
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
                );
            })}
        </div>
    );
}

export default RunsContainer;