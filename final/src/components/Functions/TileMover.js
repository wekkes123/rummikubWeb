import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import React from 'react';
import Tile from '../Tile';

export function flyTileBetweenContainers({ tile, fromElem, toElem, onComplete = () => {} }) {
    const overlayContainer = document.getElementById('tile-overlay-root');
    if (!fromElem || !toElem || !overlayContainer) {
        console.warn('Could not find elements for animation');
        return;
    }

    const fromRect = fromElem.getBoundingClientRect();
    const toRect = toElem.getBoundingClientRect();
    const overlayRect = overlayContainer.getBoundingClientRect();

    const fromX = fromRect.left - overlayRect.left;
    const fromY = fromRect.top - overlayRect.top;
    const toX = toRect.left - overlayRect.left;
    const toY = toRect.top - overlayRect.top;

    const [color, number] = tile.split('-');

    const tileProps = {
        id: tile,
        color: color,
        number: number,
        isHighlighted: true,
        isGreyedOut: false,
        flash: false,
    };

    const flyingTileDiv = document.createElement('div');
    overlayContainer.appendChild(flyingTileDiv);
    const root = createRoot(flyingTileDiv);

    const tileComponent = (
        <motion.div
            initial={{ x: fromX, y: fromY }}
            animate={{ x: toX, y: toY }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            onAnimationComplete={() => {
                root.unmount();
                overlayContainer.removeChild(flyingTileDiv);
                onComplete();
            }}
        >
            <Tile {...tileProps} />
        </motion.div>
    );

    root.render(tileComponent);
}
