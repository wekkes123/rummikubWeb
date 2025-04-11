import React from 'react';
import DropZone from '../dragDrop/DropZone';
import Tile from './Tile';
import DraggableTile from '../dragDrop/DraggableTile';
import { removeOriginalTile, isTileMoveValid } from './Functions/gamePlayFunctions'
import '../css/style.css'

function GroupsContainer({ groups, sectionIndex, updateBoardTile, tilesAreDraggable = true, getBoardValue, removeFromHand, firstTurn, flash}) {
    const handleTileDrop = (draggedTileData, dropData) => {
        console.log('Tile dropped in run:', draggedTileData, dropData);

        const tileId = `${draggedTileData.color}-${draggedTileData.number}`;
        let dropIndex = dropData.tileIndex;
        const moveValidation = isTileMoveValid(draggedTileData, dropData, getBoardValue);
        if(moveValidation === '0'){
            return;
        } else if(moveValidation.charAt(0) === 'm'){ //there is a tile where the user wants to drop the tile, but there is a free space in the group, we get the index from the function so we dont get duplicate calculations
            dropIndex = moveValidation.charAt(1);
        }

        removeOriginalTile(draggedTileData, updateBoardTile, removeFromHand)

        updateBoardTile(
            sectionIndex,
            dropData.groupIndex,
            dropIndex,
            tileId,
            firstTurn
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
                            curlo: tileIndex,
                            flash: tileValue !== 0 && tileValue !== '0' ? flash : false,
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