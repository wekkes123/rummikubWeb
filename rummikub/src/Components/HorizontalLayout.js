import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

function HorizontalLayout({ children }) {
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        // Check orientation on resize
        window.addEventListener('resize', checkOrientation);

        // Initial check
        checkOrientation();

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkOrientation);
        };
    }, []);

    // If in landscape mode, render normally
    if (!isPortrait) {
        return <div>{children}</div>;
    }

    // If in portrait mode, apply horizontal rotation
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vh', // Full height of the viewport becomes width
                height: '100vw', // Full width of the viewport becomes height
                transformOrigin: 'top left',
                transform: 'rotate(90deg) translate(0, -100%)',
                overflow: 'hidden',
                backgroundColor: 'white', // Optional: set background color
            }}
        >
            <Helmet>
                <meta
                    name="viewport"
                    content="width=device-height, initial-scale=1, maximum-scale=1, user-scalable=no"
                />
                <style>{`
          body, html {
            overflow: hidden;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
        `}</style>
            </Helmet>
            {children}
        </div>
    );
}

export default HorizontalLayout;