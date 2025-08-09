import React, { useEffect, useState } from 'react';
import { Space, Button } from "antd";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';
import '../css/dev.css';
import {
    getAverageThinkTime,
    getGamesCompletedByUser,
    getPileMovePercentage,
    getSuccessfulMovePercentage
} from "../components/Functions/gameplayMetrics";

dayjs.extend(localizedFormat);
dayjs.locale('en');

function DevPage() {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [seed, setSeed] = useState('');
    const [birthday, setBirthday] = useState('');
    const [lastGameTime, setLastGameTime] = useState(null);
    const [pileMoveAVG, setPileMoveAVG] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(0);
    const [successfulMovePercentage, setSuccessfulMovePercentage] = useState(0);
    const [avgThinkTime, setAvgThinkTime] = useState(null);
    const [averageGameTime, setAverageGameTime] = useState(null);
    const [averagePlayerScore, setAveragePlayerScore] = useState(null);
    const [averageCpuScore, setAverageCpuScore] = useState(null);
    const [gamesStarted, setGamesStarted] = useState(0);
    const [gamesRatio, setGamesRatio] = useState(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem('pseudonym');
        const savedAge = localStorage.getItem('age');
        let savedSeed = localStorage.getItem('seed');
        if (!savedSeed) {
            savedSeed = 'default_seed';
            localStorage.setItem('seed', savedSeed);
        }
        const savedBirthday = localStorage.getItem('birthday');
        const savedLastGameTime = localStorage.getItem('lastGameTime');
        const totalGameTimeArray = JSON.parse(localStorage.getItem('totalGameTime')) || [];
        const totalGameScoreArray = JSON.parse(localStorage.getItem('totalGameScore')) || [];
        const storedGamesStarted = parseInt(localStorage.getItem('gamesStarted') || '0', 10);

        setPileMoveAVG(getPileMovePercentage);
        setGameCompleted(getGamesCompletedByUser);
        setSuccessfulMovePercentage(getSuccessfulMovePercentage);
        setAvgThinkTime(getAverageThinkTime);

        if (savedUsername) setUsername(savedUsername);
        if (savedAge) setAge(savedAge);
        if (savedSeed) setSeed(savedSeed);
        if (savedBirthday) {
            setBirthday(dayjs(savedBirthday).format('D MMMM YYYY'));
        }
        if (savedLastGameTime) {
            setLastGameTime(savedLastGameTime);
        }

        if (totalGameTimeArray.length > 0) {
            const avg = (
                totalGameTimeArray.reduce((a, b) => a + b, 0) / totalGameTimeArray.length
            ).toFixed(2);
            setAverageGameTime(avg);
        }

        if (totalGameScoreArray.length > 0) {
            const avgPlayer = (
                totalGameScoreArray.reduce((sum, game) => sum + game.player, 0) / totalGameScoreArray.length
            ).toFixed(2);
            const avgCpu = (
                totalGameScoreArray.reduce((sum, game) => sum + game.cpu, 0) / totalGameScoreArray.length
            ).toFixed(2);
            setAveragePlayerScore(avgPlayer);
            setAverageCpuScore(avgCpu);
        }

        setGamesStarted(storedGamesStarted);

        if (storedGamesStarted > 0) {
            setGamesRatio(((getGamesCompletedByUser() / storedGamesStarted) * 100).toFixed(2));
        } else {
            setGamesRatio(null);
        }
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
            birthday,
            seed,
            lastGameTime,
            pileMoveAVG,
            gameCompleted,
            successfulMovePercentage,
            avgThinkTime,
            averageGameTime,
            averagePlayerScore,
            averageCpuScore,
            gamesStarted,
            gamesRatio
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
            <p><strong>pseudonym hash:</strong> {username || 'Not set'}</p>
            <p><strong>Age:</strong> {age || 'Not set'}</p>
            <p><strong>Birthday:</strong> {birthday || 'Not set'}</p>
            <p><strong>Seed:</strong> {seed || 'Not set'}</p>

            <p><strong>Last Game Time:</strong> {lastGameTime ? `${lastGameTime} seconds` : 'No game played yet'}</p>
            <p><strong>Average Game Time:</strong> {averageGameTime ? `${averageGameTime} seconds` : 'No data yet'}</p>
            <p><strong>Average Player Score:</strong> {averagePlayerScore !== null ? averagePlayerScore : 'No data yet'}</p>
            <p><strong>Average CPU Score:</strong> {averageCpuScore !== null ? averageCpuScore : 'No data yet'}</p>
            <p><strong>Pile Move Average:</strong> {pileMoveAVG}%</p>
            <p><strong>Successful Move Percentage:</strong> {successfulMovePercentage}%</p>
            <p><strong>Erroneous Move Percentage:</strong> {100 - successfulMovePercentage}%</p>
            <p><strong>Games Completed:</strong> {gameCompleted} games completed</p>
            <p><strong>Average ThinkTime:</strong> {avgThinkTime ? `${avgThinkTime / 1000} seconds` : 'No game played yet'} </p>
            <p><strong>Games Started:</strong> {gamesStarted}</p>
            <p><strong>Games Solved Ratio:</strong> {gamesRatio !== null ? `${gamesRatio}%` : 'No data yet'}</p>

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