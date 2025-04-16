import React from 'react';
import { useDrop } from 'react-dnd';

function DropZone({ onDrop, children, dropData, className, canDrop }) {
    const [{ isOver, canDropItem }, dropRef] = useDrop({
        accept: 'TILE',
        drop: (draggedTile) => {
            // Only process the drop if canDrop function allows it
            if (typeof canDrop === 'function' && !canDrop(draggedTile, dropData)) {
                return undefined; // Explicitly return undefined to indicate drop was rejected
            }

            if (onDrop) {
                return onDrop(draggedTile, dropData);
            }
            return undefined;
        },
        canDrop: (draggedTile) => {
            // If canDrop function is provided, use it, otherwise allow drops by default
            if (typeof canDrop === 'function') {
                return canDrop(draggedTile, dropData);
            }
            return true;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDropItem: monitor.canDrop(),
        }),
    });

    // Determine visual feedback based on whether item can be dropped
    const dropFeedbackColor = isOver
        ? (canDropItem ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)')
        : 'transparent';

    return (
        <div
            ref={dropRef}
            className={`drop-zone ${className || ''}`}
            style={{ backgroundColor: dropFeedbackColor }}
            data-can-drop={canDropItem} // For debugging
        >
            {children}
        </div>
    );
}

export default DropZone;