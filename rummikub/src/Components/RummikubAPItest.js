import { useState, useEffect } from "react";
import { getBestMove } from "./RummikubAPI";

function CPUOpponent({ rack, table, isFirstMove, onMoveMade, allTiles }) {
    const [cpuRack, setCpuRack] = useState(rack);
    const [cpuTable, setCpuTable] = useState(table);
    const [status, setStatus] = useState("Waiting for move...");
    const [requestData, setRequestData] = useState(null);
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        const makeCPUMove = async () => {
            if (cpuRack.length === 0) return; // Prevent unnecessary calls

            const requestPayload = { rack: cpuRack, table: cpuTable, isFirstMove };
            setRequestData(requestPayload); // Save request JSON
            console.log("Making move with payload:", requestPayload);  // Debug log for request

            try {
                const move = await getBestMove(cpuRack, cpuTable, isFirstMove);
                setResponseData(move); // Save response JSON
                console.log("Received move response:", move);  // Debug log for response

                if (move) {
                    setCpuRack(prevRack => prevRack.filter(tile => !move.tilesToPlay.includes(tile)));
                    setCpuTable(prevTable => [...prevTable, ...move.setsToMake]);
                    setStatus("CPU played a move!");
                    onMoveMade(move);
                } else {
                    setStatus("CPU has no valid move and must draw a tile.");
                    if (allTiles && allTiles.length > 0) {
                        const drawnTile = allTiles.pop();
                        setCpuRack(prevRack => [...prevRack, drawnTile]); // Simulate drawing a tile
                    }
                }
            } catch (error) {
                console.error("Error fetching CPU move:", error);
                setStatus("Error fetching CPU move.");
            }
        };

        makeCPUMove();
    }, [cpuRack, cpuTable, isFirstMove, allTiles]); // Add allTiles dependency

    return (
        <div>
            <h3>CPU Status: {status}</h3>

            <h4>Request JSON:</h4>
            <pre>{JSON.stringify(requestData, null, 2)}</pre>

            <h4>Response JSON:</h4>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
    );
}

export default CPUOpponent;
