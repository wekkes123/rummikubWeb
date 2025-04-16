import React from 'react';
import GroupsContainer from './GroupsContainer';
import RunsContainer from './RunsContainer';

function GameBoard({
                       board,
                       updateBoardTile,
                       getBoardValue,
                       tilesAreDraggable,
                       removeFromHand,
                       firstTurn,
                       flashAllTiles
                   }) {
    const [groups1, groups2, runs, playerhand, cpuhand] = board;

    return (
        <div className="container2">
            <div className="board-section">
                <GroupsContainer
                    groups={groups1}
                    sectionIndex={0}
                    updateBoardTile={updateBoardTile}
                    getBoardValue={getBoardValue}
                    tilesAreDraggable={tilesAreDraggable}
                    removeFromHand={removeFromHand}
                    firstTurn={firstTurn}
                    flash={flashAllTiles}
                />
            </div>

            <div className="board-section">
                <GroupsContainer
                    groups={groups2}
                    sectionIndex={1}
                    updateBoardTile={updateBoardTile}
                    getBoardValue={getBoardValue}
                    tilesAreDraggable={tilesAreDraggable}
                    removeFromHand={removeFromHand}
                    firstTurn={firstTurn}
                    flash={flashAllTiles}
                />
            </div>

            <div className="board-section">
                <RunsContainer
                    runs={runs}
                    sectionIndex={2}
                    updateBoardTile={updateBoardTile}
                    getBoardValue={getBoardValue}
                    tilesAreDraggable={tilesAreDraggable}
                    removeFromHand={removeFromHand}
                    firstTurn={firstTurn}
                    flash={flashAllTiles}
                />
            </div>
        </div>
    );
}

export default GameBoard;
