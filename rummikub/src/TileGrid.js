// src/TileGrid.js
import React from 'react';
import Tile from './Tile';  // Import the Tile component
import tileData from './TileData';  // Import the tile data

const TileGrid = () => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 100px)', // Adjust based on tile size
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {tileData.map((tile, index) => (
                <Tile
                    key={index}
                    image={tile.image}  // Path to your image files
                    value={tile.value}
                    color={tile.color}  // Pass the color for styling purposes (game logic)
                />
            ))}
        </div>
    );
};

export default TileGrid;
