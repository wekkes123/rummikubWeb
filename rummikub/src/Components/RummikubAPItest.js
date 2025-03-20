import { useState, useEffect } from "react";
import { getBestMove } from "./RummikubAPI";

const CPUOpponent = ({ rack, table, isFirstMove, onMoveMade }) => {
    const [cpuRack, setCpuRack] = useState(rack);
    const [cpuTable, setCpuTable] = useState(table);
    const [status, setStatus] = useState("Waiting for move...");

    useEffect(() => {
        const makeCPUMove = async () => {
            const move = await getBestMove(cpuRack, cpuTable, isFirstMove);

            if (move) {
                setCpuRack((prevRack) => prevRack.filter(tile => !move.tilesToPlay.includes(tile)));
                setCpuTable([...cpuTable, ...move.setsToMake]);
                setStatus("CPU played a move!");
                onMoveMade(move);
            } else {
                setStatus("CPU has no valid move and must draw a tile.");
            }
        };

        makeCPUMove();
    }, [cpuRack, cpuTable, isFirstMove]);

    return <div>{status}</div>;
};

export default CPUOpponent;
