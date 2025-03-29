export function createSeededRNG(seed) {
    // Convert string seed to a number if needed
    let seedNum = typeof seed === 'string' ?
        seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;

    return function() {
        let t = seedNum += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// Example usage for shuffling an array with the RNG
export function shuffleArray(array, rngFunction) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rngFunction() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}






















// example with ui:
/*
import React, { useState, useEffect } from 'react';

const SeededRandomGenerator = () => {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(106); // Default to Rummikub tile count
    const [seed, setSeed] = useState("");
    const [generatedNumber, setGeneratedNumber] = useState(null);
    const [generatedNumbers, setGeneratedNumbers] = useState([]);
    const [rng, setRng] = useState(() => createSeededRNG(Date.now())); // Initialize with current time

    // Mulberry32 algorithm for seeded random number generation
    function createSeededRNG(seed) {
        // Convert string seed to a number if needed
        let seedNum = typeof seed === 'string' ?
            seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;

        return function() {
            let t = seedNum += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Initialize the seeded random number generator when seed changes
    useEffect(() => {
        if (seed) {
            setRng(() => createSeededRNG(seed));
        }
    }, [seed]);

    const generateNumber = () => {
        if (!rng) {
            alert("Please enter a seed first!");
            return;
        }

        const randomValue = Math.floor(rng() * (max - min + 1)) + min;
        setGeneratedNumber(randomValue);
        setGeneratedNumbers(prev => [...prev, randomValue]);
    };

    const resetGenerator = () => {
        if (seed) {
            setRng(() => createSeededRNG(seed));
            setGeneratedNumbers([]);
            setGeneratedNumber(null);
        }
    };

    const handleSeedChange = (e) => {
        setSeed(e.target.value);
        setGeneratedNumbers([]);
        setGeneratedNumber(null);
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '400px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Seeded Random Number Generator</h2>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="min" style={{ display: 'block', marginBottom: '4px' }}>Minimum Value</label>
                    <input
                        id="min"
                        type="number"
                        value={min}
                        onChange={(e) => setMin(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="max" style={{ display: 'block', marginBottom: '4px' }}>Maximum Value</label>
                    <input
                        id="max"
                        type="number"
                        value={max}
                        onChange={(e) => setMax(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label htmlFor="seed" style={{ display: 'block', marginBottom: '4px' }}>Seed Value</label>
                <input
                    id="seed"
                    type="text"
                    value={seed}
                    onChange={handleSeedChange}
                    placeholder="Enter any text or number"
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {generatedNumber !== null && (
                <div style={{
                    backgroundColor: '#f0f8ff',
                    padding: '16px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    marginBottom: '16px'
                }}>
                    <p style={{ margin: 0, fontSize: '16px' }}>
                        Generated Number: <span style={{ fontWeight: 'bold', color: '#0066cc' }}>{generatedNumber}</span>
                    </p>
                </div>
            )}

            {generatedNumbers.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Generated Sequence:</label>
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '8px',
                        borderRadius: '4px',
                        maxHeight: '128px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                    }}>
                        {generatedNumbers.join(', ')}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={generateNumber}
                    style={{
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }}
                >
                    Generate Number
                </button>
                <button
                    onClick={resetGenerator}
                    style={{
                        backgroundColor: 'white',
                        color: '#333',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default SeededRandomGenerator;*/