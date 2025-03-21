import React from 'react';
import { useDrag } from 'react-dnd';
import tileData from './TileData';

const Tile = ({ id, value, color, location, position, moveTile, isDraggingEnabled }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tile',
        item: { id, location, position },
        canDrag: isDraggingEnabled,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [id, location, position, isDraggingEnabled]);

    // Convert value to string to match the tileData
    const tileImage = tileData.find(tile => tile.value === String(value) && tile.color === color)?.image;

    return (
        <div
            ref={drag}
            className="tile"
            style={{
                backgroundColor: color,
                opacity: isDragging ? 0.5 : 1,
                cursor: isDraggingEnabled ? 'move' : 'not-allowed',
                width: '60px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            }}
        >
            {tileImage && (
                <img
                    src={`/tiles/${tileImage}`}
                    alt={`${color} ${value}`}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
            )}
        </div>
    );
};

export default Tile;
