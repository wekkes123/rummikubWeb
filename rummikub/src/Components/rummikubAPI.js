const API_URL = "https://rummikubsolverapi-production.up.railway.app/solve";

/**
 * Calls the Rummikub solver API to determine the best move for a given player.
 * @param {string[]} rack - The player's current tiles.
 * @param {string[][]} table - The current sets on the table.
 * @param {boolean} isFirstMove - Whether this is the player's first move.
 * @returns {Promise<object|null>} - Returns an object containing the move details or null if no move is possible.
 */
export const getBestMove = async (rack, table, isFirstMove) => {
    const payload = {
        rack,
        table: table.flat(), // Flatten the nested array
        config: {
            numbers: 13,
            colours: 4,
            jokers: 2,
            min_len: 3
        }
    };

    const params = { maximise: "tiles", initial_meld: isFirstMove };
    const headers = { accept: "application/json", "Content-Type": "application/json" };

    try {
        const response = await fetch(`${API_URL}?maximise=tiles&initial_meld=${isFirstMove}`, {
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
            return {
                tilesToPlay: result.tiles_to_play,
                setsToMake: result.sets_to_make
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error calling Rummikub API:", error);
        return null;
    }
};
