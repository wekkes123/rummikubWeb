import React, { useEffect, useState } from 'react';

function LandscapeLayout({ children }) {
    const [orientationSupported, setOrientationSupported] = useState(true);

    useEffect(() => {
        // Check if orientation API is available - use window.screen instead of screen
        const isOrientationSupported =
            typeof window !== 'undefined' &&
            window.screen &&
            window.screen.orientation &&
            typeof window.screen.orientation.lock === 'function';

        setOrientationSupported(isOrientationSupported);

        const lockOrientation = async () => {
            if (!isOrientationSupported) {
                console.warn('Screen Orientation API not supported in this browser');
                return;
            }

            // Try all landscape orientation options
            const orientationOptions = [
                'landscape',
                'landscape-primary',
                'landscape-secondary'
            ];

            for (const orientation of orientationOptions) {
                try {
                    await window.screen.orientation.lock(orientation);
                    console.log(`Orientation locked to ${orientation}`);
                    return; // Successfully locked orientation
                } catch (error) {
                    console.warn(`Failed to lock to ${orientation}:`, error.message);
                    // Continue to next option
                }
            }

            // If we get here, all orientation lock attempts failed
            console.error('Failed to lock orientation in any landscape mode');
        };

        const unlockOrientation = () => {
            if (isOrientationSupported) {
                try {
                    window.screen.orientation.unlock();
                    console.log('Orientation unlocked');
                } catch (error) {
                    console.error('Error unlocking orientation:', error);
                }
            }
        };

        lockOrientation();

        return () => {
            unlockOrientation();
        };
    }, []);

    // Optionally show a message if orientation locking is not supported
    if (!orientationSupported) {
        // You can handle this case as needed - maybe add a CSS-based fallback
        console.warn('Screen Orientation API not supported, no orientation lock applied');
    }

    return <div>{children}</div>;
}

export default LandscapeLayout;