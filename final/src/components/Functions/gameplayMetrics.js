import { useState, useEffect } from 'react';

/**
 * Records timing data in local storage
 * @param {number} startTime - The start time in milliseconds
 * @param endTime - The end time in milliseconds
 * @param key - under what field should the timing be saved
 * @param {Object} [metadata={}] - Optional metadata to store with the timing (what move or more)
 * @returns {Array} - The complete array of timing records after adding the new one
 */
export function saveTime(startTime, endTime = null, key = "thinkTime", metadata = {}){
    let thinkTime;
    if(!endTime){
        thinkTime = Math.round(performance.now() - startTime);
    } else {
        thinkTime = Math.round(endTime - startTime);
    }
    console.log("time: ", thinkTime, metadata);
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
 * Calculates the average think time from localStorage
 * @returns {number|null} - The average think time in milliseconds, or null if no data
 */
export function getAverageThinkTime() {
    const key = "thinkTime";
    const moveTimes = localStorage.getItem(key);

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
 * Records a move and updates stats (pile, success, error) for the current user
 * @param {Object} options
 * @param {boolean} options.drewFromPile - True if the player drew from the pile
 * @param {boolean} options.successfulMove - True if the move was successful
 */
export function recordMove({ drewFromPile = false, successfulMove = false }) {
    const username = localStorage.getItem('username');
    if (!username) return;

    const key = `playerStats_${username}`;
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
    const username = localStorage.getItem('username');
    if (!username) return 0;

    const key = `playerStats_${username}`;
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
    const username = localStorage.getItem('username');
    if (!username) return 0;

    const key = `playerStats_${username}`;
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
    const username = localStorage.getItem('username');
    if (!username) return;

    const key = `gamesCompleted_${username}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (currentCount + 1).toString());
}

/**
 * Gets the number of completed games for the current user
 * @returns {number} - Games completed
 */
export function getGamesCompletedByUser() {
    const username = localStorage.getItem('username');
    if (!username) return 0;

    const key = `gamesCompleted_${username}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
}