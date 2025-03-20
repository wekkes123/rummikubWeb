import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const simulatedImages = [
            'tiles/r1.jpg',
            'tiles/r2.jpg',
            'tiles/r3.jpg',
            'tiles/r4.jpg',
            'tiles/r5.jpg',
            'tiles/r6.jpg',
            'tiles/r7.jpg',
            'tiles/r8.jpg',
            'tiles/r9.jpg',
            'tiles/r10.jpg',
            'tiles/r11.jpg',
            'tiles/r12.jpg',
            'tiles/r13.jpg',
            'tiles/o1.jpg',
            'tiles/o2.jpg',
            'tiles/o3.jpg',
            'tiles/o4.jpg',
            'tiles/o5.jpg',
            'tiles/o6.jpg',
            'tiles/o7.jpg',
            'tiles/o8.jpg',
            'tiles/o9.jpg',
            'tiles/o10.jpg',
            'tiles/o11.jpg',
            'tiles/o12.jpg',
            'tiles/o13.jpg',
            'tiles/b1.jpg',
            'tiles/b2.jpg',
            'tiles/b3.jpg',
            'tiles/b4.jpg',
            'tiles/b5.jpg',
            'tiles/b6.jpg',
            'tiles/b7.jpg',
            'tiles/b8.jpg',
            'tiles/b9.jpg',
            'tiles/b10.jpg',
            'tiles/b11.jpg',
            'tiles/b12.jpg',
            'tiles/b13.jpg',
            'tiles/z1.jpg',
            'tiles/z2.jpg',
            'tiles/z3.jpg',
            'tiles/z4.jpg',
            'tiles/z5.jpg',
            'tiles/z6.jpg',
            'tiles/z7.jpg',
            'tiles/z8.jpg',
            'tiles/z9.jpg',
            'tiles/z10.jpg',
            'tiles/z11.jpg',
            'tiles/z12.jpg',
            'tiles/z13.jpg',

        ];

        setImages(simulatedImages);
    }, []);

    const toggleBackground = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', minHeight: '100vh', padding: '20px' }}>
            <h1>Image Gallery</h1>
            <button onClick={toggleBackground} style={{ marginRight: '10px' }}>
                Switch to {isDarkMode ? 'White' : 'Black'} Background
            </button>
            <Link to="/game">Back to Game</Link>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} style={{ textAlign: 'center' }}>
                            <img src={image} alt={`Image ${index + 1}`} style={{ width: '150px', height: 'auto', objectFit: 'cover' }} />
                            <p>Image {index + 1}</p>
                        </div>
                    ))
                ) : (
                    <p>No images found in the public/tiles folder.</p>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;