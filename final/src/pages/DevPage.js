import React, { useEffect, useState } from 'react';
import {Space, Button }from "antd";
import '../css/dev.css';
import {
    getAverageThinkTime,
    getGamesCompletedByUser,
    getPileMovePercentage,
    getSuccessfulMovePercentage
} from "../components/Functions/gameplayMetrics";

function DevPage() {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [seed, setSeed] = useState('');
    const [lastGameTime, setLastGameTime] = useState(null);
    const [pileMoveAVG, setPileMoveAVG] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(0);
    const [successfulMovePercentage, setSuccessfulMovePercentage] = useState(0);
    const [avgThinkTime, setAvgThinkTime] = useState(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedAge = localStorage.getItem('age');
        let savedSeed = localStorage.getItem('seed');
        if (!savedSeed) {
            savedSeed = 'default_seed';
            localStorage.setItem('seed', savedSeed);
        }
        const savedGameTime = localStorage.getItem('lastGameTime');
        setPileMoveAVG(getPileMovePercentage)
        setGameCompleted(getGamesCompletedByUser)
        setSuccessfulMovePercentage(getSuccessfulMovePercentage)
        setAvgThinkTime(getAverageThinkTime)

        if (savedUsername) setUsername(savedUsername);
        if (savedAge) setAge(savedAge);
        if (savedSeed) setSeed(savedSeed);
        if (savedGameTime) setLastGameTime(savedGameTime);
    }, []);

    const handleSeedChange = (e) => {
        const newSeed = e.target.value;
        setSeed(newSeed);
        localStorage.setItem('seed', newSeed);
    };

    const handleEnterClick = () => {
        localStorage.setItem('seed', seed);
    };

    const handleDownload = () => {
        const data = {
            username,
            age,
            seed,
            lastGameTime,
            pileMoveAVG,
            gameCompleted,
            successfulMovePercentage,
            avgThinkTime
        };

        const json = JSON.stringify(data, null, 2);

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'devpage_data.json';
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="dev-page-container">
            <h1>Developer Page</h1>
            <p><strong>Username:</strong> {username || 'Not set'}</p>
            <p><strong>Age:</strong> {age || 'Not set'}</p>
            <p><strong>Seed:</strong> {seed || 'Not set'}</p>

            <p><strong>Last Game Time:</strong> {lastGameTime ? `${lastGameTime} seconds` : 'No game played yet'}</p>
            <p><strong>Pile Move Average:</strong> {pileMoveAVG}%</p>
            <p><strong>Successful Move Percentage:</strong> {successfulMovePercentage}%</p>
            <p><strong>Games Completed:</strong> {gameCompleted} games completed</p>
            <p><strong>Average ThinkTime:</strong> {avgThinkTime ? `${avgThinkTime/1000} seconds` : 'No game played yet'} </p>

            <div className="seed-input-container">
                <label htmlFor="seed">Change Seed:</label>
                <input
                    id="seed"
                    type="text"
                    value={seed}
                    onChange={handleSeedChange}
                    placeholder="Enter new seed"
                />
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Button
                        className="enter-button"
                        onClick={handleEnterClick}
                    >
                        Enter
                    </Button>

                    <Button className="enter-button" onClick={handleDownload}>
                        Download Data as JSON
                    </Button>
                </Space>
            </div>
        </div>
    );
}

export default DevPage;
