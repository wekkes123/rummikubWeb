import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import Tile from '../components/Tile';

function DraggableTile(props) {
    const [{ isDragging }, dragRef, dragPreview] = useDrag({
        type: 'TILE',
        item: () => {
            const time = performance.now();
            console.log(time);
            return {
                id: props.id,
                color: props.color,
                number: props.number,
                location: props.location,
                curlo: props.curlo,
                time: time
            };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const didDrop = monitor.didDrop();

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
            data-tile-id={props.id}
        >
            <Tile {...props} />
        </div>
    );
}

export default DraggableTile;