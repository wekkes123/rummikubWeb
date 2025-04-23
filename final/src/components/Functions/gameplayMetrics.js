import { useState, useEffect } from 'react';

/**
 * Records timing data in local storage
 * @param {number} startTime - The start time in milliseconds
 * @param endTime - The end time in milliseconds
 * @param {Object} [metadata={}] - Optional metadata to store with the timing (what move or more)
 * @returns {Array} - The complete array of timing records after adding the new one
 */
export function thinkTimer(startTime, endTime = null, metadata = {}){
    let thinkTime;
    if(!endTime){
        thinkTime = performance.now() - startTime;
    } else {
        thinkTime = endTime - startTime;
    }
    console.log("thought for: ", thinkTime);
    const key = "thinkTime";
    const moveTimes = localStorage.getItem(key);
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
    localStorage.setItem(key, JSON.stringify(timings));
}

/**
 * Records a pile move (draw) and updates total turn count for the player
 * @param {boolean} drewFromPile - Whether the move was a pile move
 */
export function recordMove(drewFromPile) {
    const key = 'playerPileStats';
    const stats = JSON.parse(localStorage.getItem(key)) || {
        totalTurns: 0,
        pileMoves: 0
    };

    stats.totalTurns += 1;
    if (drewFromPile) {
        stats.pileMoves += 1;
    }

    localStorage.setItem(key, JSON.stringify(stats));
}

/**
 * Gets the player's Pile Move Percentage
 * @returns {number} - Pile move percentage (0–100)
 */
export function getPileMovePercentage() {
    const key = 'playerPileStats';
    const stats = JSON.parse(localStorage.getItem(key)) || {
        totalTurns: 0,
        pileMoves: 0
    };

    if (stats.totalTurns === 0) return 0;

    return (stats.pileMoves / stats.totalTurns) * 100;
}

/**
 * Increments the count of completed games for the current user
 */
export function incrementGamesCompleted() {
    const username = localStorage.getItem('username');
    if (!username) return;

    const key = 'gamesCompletedByUser';
    const allUserData = JSON.parse(localStorage.getItem(key)) || {};

    if (!allUserData[username]) {
        allUserData[username] = 0;
    }

    allUserData[username] += 1;

    localStorage.setItem(key, JSON.stringify(allUserData));
}

/**
 * Gets the number of completed games for the current user
 * @returns {number} - Games completed by the current user
 */
export function getGamesCompletedByUser() {
    const username = localStorage.getItem('username');
    if (!username) return 0;

    const key = 'gamesCompletedByUser';
    const allUserData = JSON.parse(localStorage.getItem(key)) || {};

    return allUserData[username] || 0;
}
