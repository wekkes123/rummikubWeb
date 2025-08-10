import React from 'react';
import DropZone from '../dragDrop/DropZone';
import Tile from './Tile';
import DraggableTile from '../dragDrop/DraggableTile';
import { removeOriginalTile, isTileMoveValid, addToFirstTurnBoard } from './Functions/gamePlayFunctions'
import '../css/style.css'
const placeTileAudio = new Audio("/sounds/place.wav");

/**
 * makes functional visuals for the groups container
 * @param groups
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
function GroupsContainer({ groups, sectionIndex, updateBoardTile, tilesAreDraggable = true, getBoardValue, removeFromHand, firstTurn,onDragStart}) {

    const handleTileDrop = (draggedTileData, dropData) => {
        console.log('Tile dropped in run:', draggedTileData, dropData);
        if(draggedTileData.time){
            onDragStart(draggedTileData.time)
        }
        const tileId = `${draggedTileData.color}-${draggedTileData.number}`;
        let dropIndex = dropData.tileIndex;
        const moveValidation = isTileMoveValid(draggedTileData, dropData, getBoardValue);
        if(moveValidation === '0'){
            return;
        } else if(moveValidation.charAt(0) === 'm'){ //there is a tile where the user wants to drop the tile, but there is a free space in the group, we get the index from the function so we dont get duplicate calculations
            dropIndex = moveValidation.charAt(1);
        }
        removeOriginalTile(draggedTileData, updateBoardTile, removeFromHand, firstTurn);
        const add = addToFirstTurnBoard(draggedTileData, getBoardValue)
        placeTileAudio.play();

        updateBoardTile(
            sectionIndex,
            dropData.groupIndex,
            dropIndex,
            tileId,
            add
        );
    };

    const handleTileDragEnd = (item) => {
        console.log("Tile drag ended without successful drop:", item);
    };

    return (
        <div className="groups">
            {groups.map((group, groupIndex) => (
                <div key={`group-${sectionIndex}-${groupIndex}`} className="group" id={groupIndex}>
                    {group.map((tileValue, tileIndex) => {
                        let color = '';
                        let number = '';
                        let isHighlighted = false;
                        let isGreyedOut = true;

                        if (tileValue !== 0 && tileValue !== '0') {
                            isHighlighted = true;
                            isGreyedOut = false;

                            const [colorPart, numberPart] = tileValue.split('-');

                            color = colorPart;
                            number = numberPart;
                        }

                        const tileProps = {
                            id: tileValue !== 0 && tileValue !== '0' ? tileValue : '0',
                            color: color,
                            number: number,
                            isHighlighted: isHighlighted,
                            isGreyedOut: isGreyedOut,
                            location: `group-${sectionIndex}-${groupIndex}-${tileIndex}`,
                            curlo: tileIndex
                        };

                        const shouldBeDraggable = tilesAreDraggable &&
                            tileValue !== 0 &&
                            tileValue !== '0';

                        return (
                            <DropZone
                                key={`group-${sectionIndex}-${groupIndex}-${tileIndex}`}
                                className="tile-drop-zone"
                                dropData={{
                                    sectionIndex,
                                    groupIndex,
                                    tileIndex,
                                    type: 'group'
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
            ))}
        </div>
    );
}

export default GroupsContainer;