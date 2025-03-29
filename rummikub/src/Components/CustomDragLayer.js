import React from 'react';
import { useDragLayer } from 'react-dnd';
import tileData from './TileData';
import { Image } from 'antd';

const CustomDragLayer = () => {
    const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !currentOffset) {
        return null;
    }

    if (itemType !== 'tile') {
        return null;
    }

    const tileImage = tileData.find(
        tile => tile.value === String(item.value) && tile.color === item.color
    )?.image;

    const getItemStyles = () => {
        const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;
        return {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 100,
            left: 0,
            top: 0,
            transform,
            WebkitTransform: transform,
        };
    };

    return (
        <div style={getItemStyles()}>
            <div
                className="tile-preview"
                style={{
                    backgroundColor: item.color,
                    width: '40px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    boxShadow: '4px 4px 8px rgba(0,0,0,0.5)',
                }}
            >
                {tileImage && (
                    <Image
                        src={`/tiles/${tileImage}`}
                        alt={`${item.color} ${item.value}`}
                        style={{ maxWidth: '100%', maxHeight: '90%' }}
                        preview={false}
                    />
                )}
            </div>
        </div>
    );
};

export default CustomDragLayer;