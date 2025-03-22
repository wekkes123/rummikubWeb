import React from 'react';
import { useDrop } from 'react-dnd';
import Tile from './Tile';

const BoardSpace = ({ x, y, children, moveTile, isDraggingEnabled }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'tile',
        drop: (item) => {
            if (isDraggingEnabled) {
                moveTile(item.id, item.location, 'board', { x, y }, item.position);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
        canDrop: () => isDraggingEnabled,
    }), [x, y, moveTile, isDraggingEnabled]); // Add dependencies here

    return (
        <div
            ref={drop}
            className="board-space"
            style={{
                backgroundColor: isOver && isDraggingEnabled ? '#f0f0f0' : '#ffffff',
                border: '1px solid #ccc',
            }}
        >
            {children}
        </div>
    );
};

export default BoardSpace;