import { useState, useEffect } from 'react';

/**
 * Records timing data in local storage
 * @param {number} time - The time in milliseconds to record
 * @param {Object} [metadata={}] - Optional metadata to store with the timing (wha move or more)
 * @returns {Array} - The complete array of timing records after adding the new one
 */
export function thinkTimer(time, metadata = {}){
    const thinkTime = performance.now() - time;
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