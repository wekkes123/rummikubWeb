import React, { useEffect, useState } from 'react';

const GamePage = ({ onBackToFrontPage }) => {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        // Get the username and age from localStorage
        const storedUsername = localStorage.getItem('username');
        const storedAge = localStorage.getItem('age');

        // Set the state with the stored values
        if (storedUsername) setUsername(storedUsername);
        if (storedAge) setAge(storedAge);
    }, []);

    return (
        <div>
            <h1>Game Page</h1>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Age:</strong> {age}</p>
            <button onClick={onBackToFrontPage}>Back to Front Page</button>
        </div>
    );
};

export default GamePage;
