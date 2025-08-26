/**
 * Records timing data in local storage
 * @param {number} startTime - The start time in milliseconds
 * @param endTime - The end time in milliseconds
 * @param key - under what field should the timing be saved
 * @param {Object} [metadata={}] - Optional metadata to store with the timing (what move or more)
 * @returns {Array} - The complete array of timing records after adding the new one
 */
export function saveTime(startTime, endTime = null, key = "thinkTime", metadata = {}) {
    const pseudonym = localStorage.getItem('pseudonym');
    const keyWithUser = pseudonym ? `${key}_${pseudonym}` : key;

    let thinkTime;
    if (!endTime) {
        thinkTime = Math.round(performance.now() - startTime);
    } else {
        thinkTime = Math.round(endTime - startTime);
    }
    console.log("time: ", thinkTime, metadata);
    const moveTimes = localStorage.getItem(keyWithUser);
    let timings = [];

    if (moveTimes) {
        try {
            timings = JSON.parse(moveTimes);
            if (!Array.isArray(timings)) {
                timings = [];
            }
        } catch (error) {
            console.error('Error parsing existing timing data:', error);
            timings = [];
        }
    }

    const newTimingRecord = {
        thinkTime: thinkTime,
        ...metadata
    };

    timings.push(newTimingRecord);
    localStorage.setItem(keyWithUser, JSON.stringify(timings));
    return timings;
}

/**
 * Calculates the average think time from localStorage
 * @returns {number|null} - The average think time in milliseconds, or null if no data
 */
export function getAverageThinkTime(key = "thinkTime") {
    const pseudonym = localStorage.getItem('pseudonym');
    const keyWithUser = pseudonym ? `${key}_${pseudonym}` : key;
    const moveTimes = localStorage.getItem(keyWithUser);

    if (!moveTimes) {
        return null;
    }

    try {
        const timings = JSON.parse(moveTimes);
        if (!Array.isArray(timings) || timings.length === 0) {
            return null;
        }

        const totalThinkTime = timings.reduce((sum, record) => sum + (record.thinkTime || 0), 0);
        return totalThinkTime / timings.length;
    } catch (error) {
        console.error('Error parsing timing data:', error);
        return null;
    }
}

/**
 * Calculates the standard deviation of think times from localStorage
 * @param {string} key - The key under which think times are stored
 * @returns {number|null} - The standard deviation in milliseconds, or null if no data
 */
export function getThinkTimeStd(key = "thinkTime") {
    const pseudonym = localStorage.getItem('pseudonym');
    const keyWithUser = pseudonym ? `${key}_${pseudonym}` : key;
    const moveTimes = localStorage.getItem(keyWithUser);

    if (!moveTimes) {
        return null;
    }

    try {
        const timings = JSON.parse(moveTimes);
        if (!Array.isArray(timings) || timings.length === 0) {
            return null;
        }

        const mean = timings.reduce((sum, record) => sum + (record.thinkTime || 0), 0) / timings.length;
        const variance = timings.reduce((sum, record) => {
            const diff = (record.thinkTime || 0) - mean;
            return sum + diff * diff;
        }, 0) / timings.length;

        return Math.sqrt(variance);
    } catch (error) {
        console.error('Error parsing timing data:', error);
        return null;
    }
}


/**
 * Records a move and updates stats (pile, success, error) for the current user
 * @param {Object} options
 * @param {boolean} options.drewFromPile - True if the player drew from the pile
 * @param {boolean} options.successfulMove - True if the move was successful
 */
export function recordMove({ drewFromPile = false, successfulMove = false }) {
    const pseudonym = localStorage.getItem('pseudonym');
    if (!pseudonym) return;

    const key = `playerStats_${pseudonym}`;
    const stats = JSON.parse(localStorage.getItem(key)) || {
        pileMoves: 0,
        successfulMoves: 0,
        errorMoves: 0
    };

    if (drewFromPile) stats.pileMoves += 1;
    if (successfulMove) stats.successfulMoves += 1;
    else stats.errorMoves += 1;

    localStorage.setItem(key, JSON.stringify(stats));
}

/**
 * Gets the Pile Move Percentage for the current user
 * @returns {number} - Pile move percentage (0–100)
 */
export function getPileMovePercentage() {
    const pseudonym = localStorage.getItem('pseudonym');
    if (!pseudonym) return 0;

    const key = `playerStats_${pseudonym}`;
    const stats = JSON.parse(localStorage.getItem(key)) || {
        pileMoves: 0,
        successfulMoves: 0
    };

    if (stats.successfulMoves === 0) return 0;
    console.log("move stats:",stats.pileMoves,stats.successfulMoves);
    return (stats.pileMoves / stats.successfulMoves) * 100;
}

/**
 * Gets the Successful Move Percentage for the current user
 * @returns {number} - Successful move percentage (0–100)
 */
export function getSuccessfulMovePercentage() {
    const pseudonym = localStorage.getItem('pseudonym');
    if (!pseudonym) return 0;

    const key = `playerStats_${pseudonym}`;
    const stats = JSON.parse(localStorage.getItem(key)) || {
        successfulMoves: 0,
        errorMoves: 0
    };

    const totalBoardMoves = stats.successfulMoves + stats.errorMoves;
    if (totalBoardMoves === 0) return 0;

    return (stats.successfulMoves / totalBoardMoves) * 100;
}

/**
 * Increments the count of completed games for the current user
 */
export function incrementGamesCompleted() {
    const pseudonym = localStorage.getItem('pseudonym');
    if (!pseudonym) return;

    const key = `gamesCompleted_${pseudonym}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (currentCount + 1).toString());
}

/**
 * Gets the number of completed games for the current user
 * @returns {number} - Games completedF
 */
export function getGamesCompletedByUser() {
    const pseudonym = localStorage.getItem('pseudonym');
    if (!pseudonym) return 0;

    const key = `gamesCompleted_${pseudonym}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
}

/**
 * Records how many tiles a user moved in a turn
 * @param {number} tilesMoved - Number of tiles moved in this turn
 * @returns {Array} - The updated array of tiles moved per turn
 */
export function recordTilesMoved(tilesMoved) {
    const pseudonym = localStorage.getItem('pseudonym');
    const key = pseudonym ? `tilesMoved_${pseudonym}` : "tilesMoved";

    let tilesArray = [];
    const existing = localStorage.getItem(key);
    if (existing) {
        try {
            tilesArray = JSON.parse(existing);
            if (!Array.isArray(tilesArray)) {
                tilesArray = [];
            }
        } catch {
            tilesArray = [];
        }
    }
    tilesArray.push(tilesMoved);
    localStorage.setItem(key, JSON.stringify(tilesArray));
}
