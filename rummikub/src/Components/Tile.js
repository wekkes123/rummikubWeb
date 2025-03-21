import React from 'react';
import tileData from './TileData';
import { Image } from 'antd';

const Tile = ({ id, value, color, location, position, moveTile, isDraggingEnabled }) => {
    const tileImage = tileData.find(tile => tile.value === String(value) && tile.color === color)?.image;

    return (
        <div
            className="tile"
            style={{
                backgroundColor: color,
                opacity: isDraggingEnabled ? 1 : 0.5, // Disable opacity change on dragging
                cursor: isDraggingEnabled ? 'pointer' : 'not-allowed',
                width: '60px',
                height: '90px',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '8px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                // Remove drag-related styles
            }}
            onClick={() => {
                if (isDraggingEnabled) {
                    // Optional: Trigger moveTile if necessary or handle click event here
                    console.log(`Tile ${id} clicked`);
                }
            }}
        >
            {tileImage && (
                <Image
                    src={`/tiles/${tileImage}`}
                    alt={`${color} ${value}`}
                    style={{ maxWidth: '100%', maxHeight: '90%' }}
                    preview={false}
                />
            )}
        </div>
    );
};

export default Tile;
