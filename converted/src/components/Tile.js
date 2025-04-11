import React, { useState, useEffect } from 'react';

function Tile({ id, color, number, isHighlighted, isGreyedOut, location, curlo, flash }) {
    const [isRed, setIsRed] = useState(false);
    useEffect(() => {
        if(flash) {
            setIsRed(true);
            setTimeout(() => setIsRed(false), 500);
            setTimeout(() => setIsRed(true), 500);
            const timeout = setTimeout(() => setIsRed(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [flash]);

    let backgroundImage;
    switch (id) {
        case '0':
            backgroundImage = 'url(./images/tileBack.png)';
            break;
        case 'empty':
            backgroundImage = 'url(./images/tileEmpty.png)';
            break;
        default:
            backgroundImage = `url('./images/${color}-0${number}.svg')`;
            break;
    }
    if (number === 'j') {
        backgroundImage = `url('./images/${color}-${number}.png')`;
    }

    const tileClasses = `
        tile 
        ${isHighlighted ? 'highlight' : ''} 
        ${isGreyedOut ? 'greyout' : ''} 
        ${isRed ? 'red' : ''}
    `;

    return (
        <div
            id={id}
            className={tileClasses}
            style={{ backgroundImage }}
            data-location={location || ''}
            data-color={color || ''}
            data-number={number || ''}
            data-curlo={curlo || ''}
        />
    );
}

export default Tile;
