// src/tilesData.js

const tileData = [
    // Orange Tiles (1-13)
    ...Array.from({ length: 13 }, (_, i) => ({
        image: `o${i + 1}.jpg`,
        value: `${i + 1}`,
        color: 'orange',
    })),

    // Blue Tiles (1-13)
    ...Array.from({ length: 13 }, (_, i) => ({
        image: `b${i + 1}.jpg`,
        value: `${i + 1}`,
        color: 'blue',
    })),

    // Black Tiles (1-13)
    ...Array.from({ length: 13 }, (_, i) => ({
        image: `z${i + 1}.jpg`,
        value: `${i + 1}`,
        color: 'black',
    })),

    // Red Tiles (1-13)
    ...Array.from({ length: 13 }, (_, i) => ({
        image: `r${i + 1}.jpg`,
        value: `${i + 1}`,
        color: 'red',
    })),

    // Jokers
    { image: 'jb.jpg', value: 'Joker', color: 'black' },
    { image: 'jr.jpg', value: 'Joker', color: 'red' },
];

export default tileData;
