import React from 'react';
import { Image } from 'antd';

const Tile = ({ image, value, color, onClick }) => {
    const colorStyle = color === 'orange' ? '#FF7F00' :
        color === 'blue' ? '#0000FF' :
            color === 'black' ? '#000000' :
                color === 'red' ? '#FF0000' :
                    'gray';

    return (
        <div
            onClick={onClick}
            style={{
                display: 'inline-block',
                width: '80px',
                height: '120px',
                backgroundColor: colorStyle,
                margin: '5px',
                textAlign: 'center',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
            }}
        >
            <Image
                src={`/tiles/${image}`}
                alt={`Tile ${value}`}
                style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                preview={false}
            />
        </div>
    );
};

export default Tile;
