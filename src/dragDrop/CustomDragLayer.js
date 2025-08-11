import React from 'react';
import { useDragLayer } from 'react-dnd';
import Tile from '../components/Tile';

/**
 * creates a custom drag layer on top of everything
 * @returns {*|null}
 * @constructor
 */
function CustomDragLayer() {
    const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !currentOffset) {
        return null;
    }

    // Calculate position styles for the dragged item
    const getItemStyles = () => {
        const { x, y } = currentOffset;

        const transform = `translate(${x}px, ${y}px)`;
        return {
            transform,
            WebkitTransform: transform,
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 1000,
            left: 0,
            top: 0,
            opacity: 1,
        };
    };

    const renderItem = () => {
        switch (itemType) {
            case 'TILE':
                return (
                    <Tile
                        id={item.id}
                        color={item.color}
                        number={item.number}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div style={getItemStyles()}>
            {renderItem()}
        </div>
    );
}

export default CustomDragLayer;