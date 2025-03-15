// src/Tile.js
import React from 'react';

const Tile = ({ image, value, color }) => {
    // Dynamic styles based on color for logic (not display)
    const colorStyle = color === 'orange' ? '#FF7F00' :
        color === 'blue' ? '#0000FF' :
            color === 'black' ? '#000000' :
                color === 'red' ? '#FF0000' :
                    'gray'; // Joker color

    return (
        <div style={{
            display: 'inline-block',
            width: '80px',
            height: '120px',
            backgroundColor: colorStyle,
            margin: '5px',
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <img src={`/images/${image}`} alt={`Tile ${value}`} style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
        </div>
    );
};

export default Tile;
