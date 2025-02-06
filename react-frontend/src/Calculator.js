import React, { useState } from 'react';
import axios from 'axios';

const Calculator = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/calculate', { input: parseFloat(input) });
            console.log("Server Response:", response.data);  // Debugging line
            setOutput(response.data.output);
        } catch (error) {
            console.error("Request Failed:", error);
        }
    };

    return (
        <div>
            <h1>Calculator</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter value"
                />
                <button type="submit">Calculate</button>
            </form>
            {output !== null && <h2>Output: {output}</h2>}
        </div>
    );
};

export default Calculator;
