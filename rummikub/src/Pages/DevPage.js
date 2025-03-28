import React, { useEffect, useState } from 'react';
import {Space, Button }from "antd";
import './dev.css';

function DevPage() {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [seed, setSeed] = useState('');
    const [lastGameTime, setLastGameTime] = useState(null); // State for last game time

    useEffect(() => {
        // Get username, age, and seed from localStorage
        const savedUsername = localStorage.getItem('username');
        const savedAge = localStorage.getItem('age');
        let savedSeed = localStorage.getItem('seed');
        if (!savedSeed) {
            savedSeed = 'default_seed';
            localStorage.setItem('seed', savedSeed);
        }
        const savedGameTime = localStorage.getItem('lastGameTime');

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
        localStorage.setItem('seed', seed); // Save seed to localStorage
    };

    // Function to trigger download of data as JSON
    const handleDownload = () => {
        const data = {
            username,
            age,
            seed,
            lastGameTime,
        };

        const json = JSON.stringify(data, null, 2); // Convert data to JSON format

        // Create a Blob from the JSON data
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'devpage_data.json'; // Filename for the download
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
