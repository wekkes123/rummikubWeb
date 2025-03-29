import React from 'react';
import { useDrag } from 'react-dnd';
import tileData from '../Logic/TileData';
import { Image } from 'antd';

const Tile = ({ id, value, color, location, position, moveTile, isDraggingEnabled }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tile',
        item: { id, location, position, color, value },
        canDrag: isDraggingEnabled,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [id, location, position, color, value, isDraggingEnabled]);

    const tileImage = tileData.find(tile => tile.value === String(value) && tile.color === color)?.image;

    return (
        <div
            ref={drag}
            className="tile"
            style={{
                backgroundColor: color,
                opacity: isDragging ? 0 : 1,
                cursor: isDraggingEnabled ? 'move' : 'not-allowed',
                width: '40px',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '8px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                touchAction: 'none',
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