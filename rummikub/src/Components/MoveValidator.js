import tileData from "./TileData";

const isValidMove = (tiles) => {
    if (tiles.length < 3) return false;

    const uniqueTiles = new Set(tiles.map(tile => `${tile.value}-${tile.color}`));
    if (uniqueTiles.size !== tiles.length) {
        return false; // If there are duplicates, it's not a valid move
    }

    const jokers = tiles.filter(tile => tile.value === "Joker");
    const nonJokerTiles = tiles.filter(tile => tile.value !== "Joker");
    const sortedTiles = [...nonJokerTiles].sort((a, b) => a.value - b.value);

    const isGroup = sortedTiles.every(tile => tile.value === sortedTiles[0].value);
    const uniqueColors = new Set(sortedTiles.map(tile => tile.color));

    if (isGroup && uniqueColors.size + jokers.length === tiles.length) {
        return true;
    }

    const isRun = sortedTiles.every(tile => tile.color === sortedTiles[0].color);

    if (isRun) {
        let missingTiles = 0;
        for (let i = 1; i < sortedTiles.length; i++) {
            const prevValue = sortedTiles[i - 1].value;
            const currentValue = sortedTiles[i].value;
            if (currentValue !== prevValue + 1) {
                missingTiles += currentValue - prevValue - 1;
            }
        }
        return missingTiles <= jokers.length;
    }
    return false;
};

export default isValidMove;
