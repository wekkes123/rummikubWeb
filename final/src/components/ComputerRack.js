import React from 'react';
import Tile from './Tile';

function ComputerRack({ cpuhand }) {

    return (
        <div className="container1">
            <div className="computer-rack">
                {cpuhand.map((tile, index) => {
                    const [color, number] = tile.split('-');

                    const tileProps = {
                        key: `${tile}-${index}`,
                        id: '0',
                        color: color,
                        number: number,
                        isGreyedOut: false,
                        isHighlighted: true,
                        location: `cpuhand-${index}`
                    };

                    return <Tile {...tileProps} />;
                })}
            </div>
        </div>
    );
}

export default ComputerRack;
