import React from 'react';
import { useDrag } from 'react-dnd';
import tileData from './TileData';
import { Image } from 'antd';

const Tile = ({ id, value, color, location, position, moveTile, isDraggingEnabled }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tile',
        item: { id, location, position },
        canDrag: isDraggingEnabled,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [id, location, position, isDraggingEnabled]);

    const tileImage = tileData.find(tile => tile.value === String(value) && tile.color === color)?.image;
    const tileWidth = 60;
    const tileHeight = tileWidth * (4/3); // Maintains a 4:3 aspect ratio

    return (
        <div
            ref={drag}
            className="tile"
            style={{
                width: tileWidth,
                //height: tileHeight,
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                opacity: isDragging ? 0.5 : 1,
                cursor: isDraggingEnabled ? 'move' : 'not-allowed',
                overflow: 'hidden',
                backgroundColor: 'white', // Base background
                position: 'relative' // For absolute positioning of children
            }}
        >
            {/* Main tile content */}
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {tileImage && (
                    <Image
                        src={`/tiles/${tileImage}`}
                        alt={`${color} ${value}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            display: 'block' // Remove any default spacing
                        }}
                        preview={false}
                    />
                )}
            </div>

            {/* Optional colored bottom border - commented out but ready to use if needed */}
            {/* <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '5%',
                backgroundColor: color
            }} /> */}
        </div>
    );
};

export default Tile;