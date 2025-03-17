import React from 'react';
import Tile from './Tile';

const TileContainer = ({ tile, onDrop }) => {
    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = () => {
        const draggedTile = JSON.parse(localStorage.getItem('draggedTile'));
        if (draggedTile) {
            onDrop(draggedTile);
            localStorage.removeItem('draggedTile');
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                width: '80px',
                height: '180px',
                backgroundColor: 'white',
                border: '1px dashed gray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {tile && (
                <Tile
                    {...tile}
                    draggable
                    onDragStart={() => localStorage.setItem('draggedTile', JSON.stringify(tile))}
                />
            )}
        </div>
    );
};

export default TileContainer;
