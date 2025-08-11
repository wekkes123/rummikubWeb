import React from 'react';
import DropZone from '../dragDrop/DropZone';
import Tile from './Tile';
import DraggableTile from '../dragDrop/DraggableTile';
import {addToFirstTurnBoard, isTileMoveValid, removeOriginalTile} from './Functions/gamePlayFunctions'

/**
 * creates functional visuals for the runs container
 * @param runs
 * @param sectionIndex
 * @param updateBoardTile
 * @param tilesAreDraggable
 * @param getBoardValue
 * @param removeFromHand
 * @param firstTurn
 * @param onDragStart
 * @returns {*}
 * @constructor
 */
function RunsContainer({ runs, sectionIndex, updateBoardTile, tilesAreDraggable = true, getBoardValue, removeFromHand, firstTurn, onDragStart }) {
    const colors = ['1', '2', '3', '4'];
    const placeTileAudio = new Audio("/sounds/place.wav");
    const colorMapping = {
        '1': '#000000',
        '2': '#29abe2',
        '3': '#fbb03b',
        '4': '#ed1c24'
    };

    const handleTileDrop = (draggedTileData, dropData) => {
        console.log('Tile dropped in run:', draggedTileData, dropData);
        if(draggedTileData.time){
            onDragStart(draggedTileData.time)
        }
        if(isTileMoveValid(draggedTileData, dropData, getBoardValue) === '0'){
            return;
        }

        removeOriginalTile(draggedTileData, updateBoardTile, removeFromHand, firstTurn)
        const add = addToFirstTurnBoard(draggedTileData, getBoardValue)

        placeTileAudio.play();

        if(draggedTileData.number === 'j'){
            updateBoardTile(
                2,
                dropData.runIndex,
                dropData.tileIndex,
                `${draggedTileData.color}-${draggedTileData.number}`,
                add
            );
        } else{
            updateBoardTile(
                2,
                dropData.runIndex,
                draggedTileData.number - 1,
                1,
                add
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
                const stripeColor = colorMapping[color];

                return (
                    <div key={`run-${runIndex}`} className="run" style={{position: 'relative'}}>
                        {/* Left color stripe
                        <div
                            className="run-stripe run-stripe-left"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '8px',
                                backgroundColor: stripeColor,
                                borderTopLeftRadius: '5px',
                                borderBottomLeftRadius: '5px'
                            }}
                        />*/}

                        {run.map((tileValue, tileIndex) => {
                            let number, isHighlighted, isGreyedOut, tileProps;
                            if (tileValue === '1-j' || tileValue === '4-j') {
                                isHighlighted = 1;
                                tileProps = {
                                    id: tileValue !== '0' ? tileValue : `run-${runIndex}-${tileIndex}`,
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
                                    id: tileValue !== '0' ? tileValue : `run-${runIndex}-${tileIndex}`,
                                    color: color,
                                    number: number,
                                    isHighlighted: isHighlighted,
                                    isGreyedOut: isGreyedOut,
                                    location: `run-${runIndex}-${tileIndex}`,
                                    curlo: tileIndex
                                };
                            }
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
                        <div
                            className="run-stripe run-stripe-right"
                            style={{
                                position: 'absolute',
                                right: -5,
                                top: -3,
                                bottom: 0,
                                width: '8px',
                                height: '120%',
                                backgroundColor: stripeColor
                            }}
                        />
                        <div
                            className="run-stripe run-stripe-right"
                            style={{
                                position: 'absolute',
                                left: -5,
                                top: -3,
                                bottom: 0,
                                width: '8px',
                                height: '120%',
                                backgroundColor: stripeColor
                            }}
                        />
                    </div>

                );
            })}
        </div>
    );
}

export default RunsContainer;