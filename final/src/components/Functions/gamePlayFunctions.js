export function removeOriginalTile(draggedTileData, updateBoardTile, removeFromHand, firstTurn = false) {
    if (draggedTileData.location) {
        if (draggedTileData.location.startsWith('group-')) {
            const [, sourceSectionIndex, sourceGroupIndex, sourceTileIndex] = draggedTileData.location.split('-').map(Number);
            if(firstTurn) {
                updateBoardTile(
                    sourceSectionIndex,
                    sourceGroupIndex,
                    sourceTileIndex,
                    '0',
                    firstTurn
                );
                return;
            }
            updateBoardTile(
                sourceSectionIndex,
                sourceGroupIndex,
                sourceTileIndex,
                '0'
            );
        } else if (draggedTileData.location.startsWith('run-')) {
            const sourceRunIndex = parseInt(draggedTileData.location.split('-')[1]);
            const sourceTileIndex = parseInt(draggedTileData.curlo);
            if(firstTurn) {
                updateBoardTile(
                    2,
                    sourceRunIndex,
                    sourceTileIndex,
                    '0',
                    firstTurn
                );
                return;
            }

            updateBoardTile(
                2,
                sourceRunIndex,
                sourceTileIndex,
                '0'
            );
        } else if (draggedTileData.location.startsWith('hand-')) {
            const [, handIndex] = draggedTileData.location.split('-').map(Number);
            removeFromHand(3, handIndex);
        }
    }
}

export function isTileMoveValid(draggedTileData, dropData, getBoardValue) {
    //if its in a group
    if (dropData.sectionIndex === 1 || dropData.sectionIndex === 0) {
        const [, sourceSectionIndex, sourceGroupIndex, sourceTileIndex] = draggedTileData.location.split('-').map(Number);

        // Check if all indexes match (same location -> dont do anything)
        const isSameLocation =
            sourceSectionIndex === dropData.sectionIndex &&
            sourceGroupIndex === dropData.groupIndex &&
            sourceTileIndex === dropData.tileIndex;

        if (isSameLocation) {
            return '0';
        }
        const row = getBoardValue(dropData.sectionIndex, dropData.groupIndex, -1)
        if (row[dropData.tileIndex] === '0'){
            /*if(!row.includes(draggedTileData.id) || (sourceSectionIndex === dropData.sectionIndex && sourceGroupIndex === dropData.groupIndex)){
                return true
            }*/
            return '1';
        } else if (row.includes('0')) {
            return `m${row.indexOf('0')}`;
        }
        return '0';
    } else if (dropData.sectionIndex === 2) { //if its in a run
        const row = getBoardValue(dropData.sectionIndex, dropData.runIndex, -1)
        //if its a joker
        if(draggedTileData.number === 'j') {
            if (row[dropData.tileIndex] === '0'){
                return '1';
            }
        }
        if (row[draggedTileData.number-1] === '0'){
            if((draggedTileData.color-1)*2 === dropData.runIndex || (draggedTileData.color-1)*2 + 1 === dropData.runIndex){
                return '1';
            }
        }
    } else if (dropData.sectionIndex === 3) { //if its in the players hand
    }
    return '0';
}

export function isValidGroup(groupArray) {
    const tiles = groupArray.filter(tile => tile !== '0');
    if (tiles.length === 0) return true;
    if (tiles.length < 3) return false;

    const seenColors = new Set();
    let expectedNumber = null;

    for (const tile of tiles) {
        const [color, value] = tile.split('-');

        if (value === 'j') {
            seenColors.add(`${tile}`); //by treating the whole joker tile as a unique color, a red joker and a red 4 for example wont cause an issue
            continue;
        }

        const colorInt = parseInt(color);
        const numberInt = parseInt(value);

        if (expectedNumber === null) {
            expectedNumber = numberInt;
        } else if (numberInt !== expectedNumber) {
            return false;
        }

        if (seenColors.has(colorInt)) {
            return false;
        }
        seenColors.add(colorInt);
    }
    return seenColors.size === tiles.length && seenColors.size <= 4;
}

export function isValidRun(tiles) {
    let i = 0;
    while (i < tiles.length) {
        // Skip no tiles
        if (tiles[i] === '0') {
            i++;
            continue;
        }
        //find tile -> check
        let runLength = 1;
        let j = i + 1;

        // Count consecutive tiles
        while (j < tiles.length && tiles[j] !== '0' && tiles[j] !== 0) {
            runLength++;
            j++;
        }
        if (runLength < 3) {
            return false;
        }
        i = j;
    }
    return true;
}

export function validateBoard(board) {
    let i = 0;
    // first group
    while (i < board[0].length) {
        if(isValidGroup(board[0][i])){
            i++
        } else {
            return false;
        }
    }
    i = 0;
    //second group
    while (i < board[1].length) {
        if(isValidGroup(board[1][i])){
            i++
        } else {
            return false;
        }
    }
    i = 0;
    //runs
    while (i < board[2].length) {
        if(isValidRun(board[2][i])){
            i++
        } else {
            return false;
        }
    }
    return true;
}

export function playedTiles(beforeHand, afterHand) {
    console.log(beforeHand,afterHand)
    const afterHandMap = new Map();

    for (const tile of afterHand) {
        afterHandMap.set(tile, (afterHandMap.get(tile) || 0) + 1);
    }
    const playedTiles = [];

    for (const tile of beforeHand) {
        const count = afterHandMap.get(tile);
        if (!count) {
            playedTiles.push(tile);
        } else {
            afterHandMap.set(tile, count - 1);
        }
    }
    return playedTiles;
}

export function findJokerValue(board, joker) {
    //groups
    for (let groupSetIndex = 0; groupSetIndex < 2; groupSetIndex++) {
        const groupSet = board[groupSetIndex];

        for (let groupIndex = 0; groupIndex < groupSet.length; groupIndex++) {
            const group = groupSet[groupIndex];

            const jokerIndex = group.indexOf(joker);
            if (jokerIndex !== -1) {
                for (let i = 0; i < group.length; i++) {
                    const tile = group[i];
                    if (tile !== '0' && tile !== '1-j' && tile !== '4-j') {
                        const [, value] = tile.split('-').map(Number)
                        return value;
                    }
                }
            }
        }
    }

    //runs
    const runs = board[2];
    for (let runIndex = 0; runIndex < runs.length; runIndex++) {
        const run = runs[runIndex];

        const jokerIndex = run.indexOf(joker);
        if (jokerIndex !== -1) {
            return jokerIndex + 1;
        }
    }
    // Joker not found, should be impossible
    return null;
}

export function addToFirstTurnBoard(draggedTileData, getBoardValue) {
    if (draggedTileData.location) {
        if (draggedTileData.location.startsWith('group-')) {
            const [, sourceSectionIndex, sourceGroupIndex, sourceTileIndex] = draggedTileData.location.split('-').map(Number);
            const [realBoard, firstHandBoard] = getBoardValue(sourceSectionIndex, sourceGroupIndex, sourceTileIndex, 1);
            return realBoard === firstHandBoard;


        } else if (draggedTileData.location.startsWith('run-')) {
            const sourceRunIndex = parseInt(draggedTileData.location.split('-')[1]);
            const sourceTileIndex = parseInt(draggedTileData.curlo);
            const [realBoard, firstHandBoard] = getBoardValue(2, sourceRunIndex, sourceTileIndex, 1);
            return realBoard === firstHandBoard;

        } else if (draggedTileData.location.startsWith('hand-')) {
            return true;
        }
    }
}