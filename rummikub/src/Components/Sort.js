import React, { useMemo } from 'react';

const sortTiles = (tiles, sortBy) => {
    return [...tiles].sort((a, b) => {
        if (sortBy === "color") {
            return a.color.localeCompare(b.color) || a.value - b.value;
        } else {
            return a.value - b.value || a.color.localeCompare(b.color);
        }
    });
};

const TileSorter = ({ tiles, sortby }) => {
    const sortedTiles = useMemo(() => sortTiles(tiles, sortby), [tiles, sortby]);

    return sortedTiles;
};

export default TileSorter;
