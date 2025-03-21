import React, { useState } from 'react';

const RummikubSolver = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [solution, setSolution] = useState(null);
    const [gameState, setGameState] = useState({
        rack: ["r1", "r2", "r3", "b1", "b2", "b3", "o1", "o12"],
        table: ["r4", "r5", "r6"],
        config: {
            numbers: 13,
            colours: 4,
            jokers: 2,
            min_len: 3
        }
    });
    const [maximise, setMaximise] = useState("tiles");
    const [initialMeld, setInitialMeld] = useState(false);

    const handleRackChange = (e) => {
        setGameState({
            ...gameState,
            rack: e.target.value.split(/[,\s]+/).filter(s => s)
        });
    };

    const handleTableChange = (e) => {
        setGameState({
            ...gameState,
            table: e.target.value.split(/[,\s]+/).filter(s => s)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSolution(null);

        try {
            // Construct URL with query parameters
            const url = new URL('https://rummikubsolverapi-production.up.railway.app/solve');
            url.searchParams.append('maximise', maximise);
            url.searchParams.append('initial_meld', initialMeld.toString());

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameState)
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            setSolution(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Rummikub Solver</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Rack (tiles in your hand)
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            rows="2"
                            value={gameState.rack.join(", ")}
                            onChange={handleRackChange}
                            placeholder="Enter tiles separated by commas (e.g. r1, r2, r3)"
                        />
                    </label>
                    <p className="text-xs text-gray-500">Format: r1=red 1, b2=blue 2, o3=orange 3, k4=black 4, j=joker</p>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Table (tiles on the board)
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            rows="2"
                            value={gameState.table.join(", ")}
                            onChange={handleTableChange}
                            placeholder="Enter tiles separated by commas (e.g. k1, k2, k3)"
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Maximise
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                value={maximise}
                                onChange={(e) => setMaximise(e.target.value)}
                            >
                                <option value="tiles">Tiles</option>
                                <option value="value">Value</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={initialMeld}
                            onChange={(e) => setInitialMeld(e.target.checked)}
                            id="initialMeld"
                        />
                        <label htmlFor="initialMeld" className="ml-2 block text-sm text-gray-700">
                            Initial Meld (30+ points required)
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {loading ? "Solving..." : "Solve"}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {solution && (
                <div className="mt-6 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Solution</h2>

                    <div className="mb-4">
                        <p className="font-medium">Status:
                            <span className={solution.success ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                {solution.success ? "Success" : "No valid move found"}
              </span>
                        </p>
                        <p className="text-gray-700">{solution.message}</p>
                    </div>

                    {solution.success && (
                        <>
                            <div className="mb-4">
                                <h3 className="font-medium text-gray-800 mb-1">Tiles to Play:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {solution.tiles_to_play.map((tile, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {tile}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">Sets to Make:</h3>
                                {solution.sets_to_make.map((set, idx) => (
                                    <div key={idx} className="mb-2">
                                        <p className="text-sm text-gray-500">Set {idx + 1}:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {set.map((tile, tileIdx) => (
                                                <span key={tileIdx} className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {tile}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <p className="font-medium">Value: <span className="text-blue-600">{solution.value}</span></p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="mt-8 text-sm text-gray-500">
                <h3 className="font-medium text-gray-700 mb-1">How to use:</h3>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>Enter the tiles in your rack (hand) separated by commas</li>
                    <li>Enter the tiles currently on the table</li>
                    <li>Select whether to maximize for tiles or value</li>
                    <li>Check "Initial Meld" if this is your first play (requires 30+ points)</li>
                    <li>Click "Solve" to find the optimal move</li>
                </ol>
            </div>
        </div>
    );
};

export default RummikubSolver;