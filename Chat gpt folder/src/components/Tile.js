import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';

const Tile = ({ id, color, location, position, moveTile, isDraggingEnabled }) => {
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        type: 'tile',
        item: { id, location, position },
        canDrag: isDraggingEnabled,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [id, location, position, isDraggingEnabled]); // Add dependencies here

    return (
        <div
            ref={drag}
            className="tile"
            style={{
                backgroundColor: color,
                opacity: isDragging ? 0.5 : 1,
                cursor: isDraggingEnabled ? 'move' : 'not-allowed',
            }}
        />
    );
};

export default Tile;