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