const API_URL = "https://rummikubsolverapi-production.up.railway.app/solve"; //change this to your own API host

const colorMap = {
    1: 'k', // black
    2: 'b', // blue
    3: 'o', // orange
    4: 'r', // red
};

const reverseMap = {
    k: '1',
    b: '2',
    o: '3',
    r: '4'
};

/**
 * Calls the Rummikub solver API to determine the best move for a given player.
 * @param {string[]} cpuHand - The player's current tiles.
 * @param {string[][]} board - The current sets on the table.
 * @param {boolean} isFirstMove - Whether this is the player's first move.
 * @returns {Promise<object|null>} - Returns an object containing the move details or null if no move is possible.
 * any problems with the api call will result in the cpu to pick up a tile
 */
export const getBestMove = async (cpuHand, board, isFirstMove) => {
    const [rack,Hjokers] = convertTiles(cpuHand)
    const [groups, runs, Bjokers] = convertBoard(board);
    const convertedGroups = convertTiles(groups);
    const table = [...convertedGroups, ...runs]

    const payload = {
        rack,
        table: table.length ? table.reduce((acc, set) => acc.concat(set), []) : [],
        config: {
            numbers: 13,
            colours: 4,
            jokers: 2,
            min_len: 3
        }
    };

    const url = new URL(API_URL);
    const params = { maximise: "tiles", initial_meld: isFirstMove };
    url.search = new URLSearchParams(params).toString();

    const headers = {
        accept: "application/json",
        "Content-Type": "application/json"
    };
    console.log(JSON.stringify(payload));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} - ${await response.text()}`);
            return null;
        }

        const result = await response.json();
        if (result.success) {
            const tiles_to_play = reverseConvertTiles(result.tiles_to_play,Hjokers);
            const [sets, joker_values] = reverseConvertSets(result.sets_to_make,Bjokers,Hjokers);
            return {
                tilesToPlay: tiles_to_play,
                setsToMake: sets,
                jokerValue: joker_values
            };
        } else {
            console.warn("API Response indicates no valid move.", result);
            return null;
        }
    } catch (error) {
        console.error("Error calling Rummikub API:", error);
        return null;
    }
};

const convertTiles = (tiles) => {
    const converted = [];
    const jokers = [];

    tiles.forEach(tile => {
        if (tile.endsWith('-j')) {
            jokers.push(tile);
            converted.push('j');
        } else {
            const [color, number] = tile.split('-');
            const colorLetter = colorMap[Number(color)];
            converted.push(`${colorLetter}${number}`);
        }
    });

    return [converted, jokers];
};


const convertBoard = (board) => {
    const groupTiles = [];
    const runTiles = [];

    const colorMap = ['k', 'k', 'b', 'b', 'o', 'o', 'r', 'r']; // index matches run group index

    const groups1 = board[0];
    const groups2 = board[1];
    const runs = board[2];
    const Bjokers = [];

    groups1.forEach(group => group.forEach(tile => {
        if (tile !== '0') groupTiles.push(tile);
        if (tile === "1-j" || tile === "4-j") {
            Bjokers.push(tile);
        }
    }));

    groups2.forEach(group => group.forEach(tile => {
        if (tile !== '0') groupTiles.push(tile);
        if (tile === "1-j" || tile === "4-j") {
            Bjokers.push(tile);
        }
    }));

    runs.forEach((runGroup, groupIndex) => {
        const colorLetter = colorMap[groupIndex];

        runGroup.forEach((tile, i) => {
            if (tile === 1) {
                runTiles.push(`${colorLetter}${i + 1}`); // i+1 is the number of the tile
            } else if (tile === '1-j' || tile === '4-j') {
                Bjokers.push(tile);
                runTiles.push('j');
            }
        });
    });
    return [groupTiles, runTiles, Bjokers];
};

const reverseConvertSets = (move, Bjokers, Hjokers) => {
    const usedJokers = [];

    const convertedMoves = move.map(([set, jokerValues]) => {
        const [type, ...tiles] = set;

        const converted = tiles.map(tile => {
            if (tile === 'j') {
                const jokerTile = Bjokers.length > 0 ? Bjokers.shift() : Hjokers.shift();
                const jokerValue = jokerValues[0];
                usedJokers.push([jokerTile, jokerValue]);
                return jokerTile;
            }

            const colorLetter = tile[0];
            const number = tile.slice(1);
            const colorNumber = reverseMap[colorLetter];

            return `${colorNumber}-${number}`;
        });

        return [type, ...converted];
    });


    return [convertedMoves, usedJokers];
};



const reverseConvertTiles = (tiles, Hjoker) => {
    let index = 0;
    return tiles.map(tile => {
        if (tile === 'j') {
            const jokerTile = Hjoker[index];
            index += 1;
            return jokerTile;
        }

        const colorLetter = tile[0];
        const number = tile.slice(1);
        const colorNumber = reverseMap[colorLetter];

        return `${colorNumber}-${number}`;
    });
};





