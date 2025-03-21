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
        table: table.length ? table.reduce((acc, set) => acc.concat(set), []) : [], // Flatten table
        config: {
            numbers: 13,
            colours: 4,
            jokers: 2,
            min_len: 3
        }
    };

    // Create URL with query parameters
    const url = new URL(API_URL);
    const params = { maximise: "tiles", initial_meld: isFirstMove };
    url.search = new URLSearchParams(params).toString();

    const headers = {
        accept: "application/json",
        "Content-Type": "application/json"
    };

    try {
        console.log("Sending request:", JSON.stringify(payload, null, 2));  // Log the request payload

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} - ${await response.text()}`);
            return null;
        }

        const result = await response.json();
        console.log("API Response:", result); // Log the full response

        if (result.success) {
            return {
                tilesToPlay: result.tiles_to_play,
                setsToMake: result.sets_to_make
            };
        } else {
            console.warn("API Response indicates no valid move.");
            return null;
        }
    } catch (error) {
        console.error("Error calling Rummikub API:", error);
        return null;
    }
};
