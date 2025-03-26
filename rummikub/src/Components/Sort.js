const sortTiles = (tiles, sortBy) => {
    return [...tiles].sort((a, b) => {
        const isJokerA = a.value === "Joker";
        const isJokerB = b.value === "Joker";

        if (isJokerA && !isJokerB) return 1;
        if (!isJokerA && isJokerB) return -1;

        if (sortBy === "color") {
            return a.color.localeCompare(b.color) || a.value - b.value;
        } else if (sortBy === "value") {
            return a.value - b.value || a.color.localeCompare(b.color);
        }
        return 0;
    });
};

const TileSorter = (tiles, sortBy) => {
    return sortBy ? sortTiles(tiles, sortBy) : tiles;
};

export default TileSorter;
