import React from 'react';
import { useDragLayer } from 'react-dnd';
import Tile from '../components/Tile';

function CustomDragLayer() {
    const {
        itemType,
        isDragging,
        item,
        initialOffset,
        currentOffset,
        initialClientOffset,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    const previewRef = React.useRef(null);
    const loggedOnceRef = React.useRef(false);

    const grabOffset = React.useMemo(() => {
        if (!initialOffset || !initialClientOffset) return null;
        return {
            x: initialClientOffset.x - initialOffset.x,
            y: initialClientOffset.y - initialOffset.y,
        };
    }, [initialOffset, initialClientOffset]);

    React.useEffect(() => {
        if (isDragging && !loggedOnceRef.current && grabOffset) {
            requestAnimationFrame(() => {
                const rect = previewRef.current?.getBoundingClientRect();
                if (rect) {
                    const entry = {
                        x: Math.round(grabOffset.x),
                        y: Math.round(grabOffset.y),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                    };
                    const key = 'tile_click_accuracy';
                    const prev = localStorage.getItem(key);
                    const list = prev ? JSON.parse(prev) : [];
                    list.push(entry);
                    localStorage.setItem(key, JSON.stringify(list));
                    loggedOnceRef.current = true;
                }
            });
        }
        if (!isDragging) {
            loggedOnceRef.current = false;
        }
    }, [isDragging, grabOffset]);

    if (!isDragging || !currentOffset) return null;

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
        <div ref={previewRef} style={getItemStyles()}>
            {renderItem()}
        </div>
    );
}

export default CustomDragLayer;