import { useMemo } from 'react';

const sortTiles = (tiles, sortBy) => {
    return [...tiles].sort((a, b) => {
        const isJokerA = a.value === "Joker";
        const isJokerB = b.value === "Joker";

        // Always move jokers to the end
        if (isJokerA && !isJokerB) return 1;
        if (!isJokerA && isJokerB) return -1;

        if (sortBy === "color") {
            return a.color.localeCompare(b.color) || a.value - b.value;
        } else {
            return a.value - b.value || a.color.localeCompare(b.color);
        }
    });
};

const TileSorter = ({ tiles, sortby }) => {
    return useMemo(() => sortTiles(tiles, sortby), [tiles, sortby]);
};

export default TileSorter;
