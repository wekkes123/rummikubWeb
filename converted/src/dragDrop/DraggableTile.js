import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import Tile from '../components/Tile';

function DraggableTile(props) {
    const [{ isDragging }, dragRef, dragPreview] = useDrag({
        type: 'TILE',
        item: () => ({
            id: props.id,
            color: props.color,
            number: props.number,
            location: props.location,
            curlo: props.curlo
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            // This function runs when the drag operation ends - successful or not
            const didDrop = monitor.didDrop();

            // If drop wasn't successful and there's an onDragEnd callback, call it
            if (!didDrop && props.onDragEnd) {
                props.onDragEnd(item);
            }
        }
    });

    return (
        <div
            ref={dragRef}
            style={{
                opacity: isDragging ? 0.3 : 1,
                cursor: 'move'
            }}
            data-tile-id={props.id} // Adding data attribute to help with debugging
        >
            <Tile {...props} />
        </div>
    );
}

export default DraggableTile;