import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useDrop } from 'react-dnd';
import Tile from './Tile';
import PileButton from './PileButton';
import TileSorter from '../Logic/Sort';
import { useTranslation } from 'react-i18next';
import '../../css/button.css'

const MAX_SLOTS = 20;
const SLOTS_PER_ROW = MAX_SLOTS/2;

const PlayerHand = ({ tiles, moveTile, isDraggingEnabled, isHidden, leftHanded = false, pickTile }) => {
    const [displayTiles, setDisplayTiles] = useState([...tiles, ...Array(MAX_SLOTS - tiles.length).fill(null)]);

    const { t } = useTranslation();

    useEffect(() => {
        const updatedDisplayTiles = [...displayTiles];
        const missingTiles = displayTiles.filter(tile => tile && !tiles.some(t => t.id === tile.id));

        missingTiles.forEach(missingTile => {
            const index = updatedDisplayTiles.findIndex(t => t && t.id === missingTile.id);
            if (index !== -1) {
                updatedDisplayTiles[index] = null;
            }
        });
        const finalDisplayTiles = [
            ...updatedDisplayTiles,
            ...Array(MAX_SLOTS - updatedDisplayTiles.length).fill(null)
        ];
        setDisplayTiles(finalDisplayTiles);
    }, [tiles]);

    const applySort = (sortBy) => {
        const newSortedTiles = TileSorter(tiles.filter(Boolean), sortBy);
        setDisplayTiles([...newSortedTiles, ...Array(MAX_SLOTS - newSortedTiles.length).fill(null)]);
    };

    const moveTileInHand = (tileId, newIndex) => {
        const tileIndex = displayTiles.findIndex(tile => tile && tile.id === tileId);
        if (tileIndex === -1 || tileIndex === newIndex) return;

        const updatedTiles = [...displayTiles];
        [updatedTiles[tileIndex], updatedTiles[newIndex]] = [updatedTiles[newIndex], updatedTiles[tileIndex]];

        setDisplayTiles(updatedTiles);
    };

    const handlePickTile = () => {
        const newTile = pickTile();
        if (newTile) {
            setDisplayTiles(prevTiles => {
                const updatedTiles = [...prevTiles];
                if (updatedTiles.length === MAX_SLOTS && !updatedTiles.includes(null)) {
                    return prevTiles;
                }

                const emptySlotIndex = updatedTiles.findIndex(tile => tile === null);
                if (emptySlotIndex !== -1 ) {
                    updatedTiles[emptySlotIndex] = newTile;
                }


                return updatedTiles;
            });
        }
    };

    const firstRowTiles = displayTiles.slice(0, SLOTS_PER_ROW);
    const secondRowTiles = displayTiles.slice(SLOTS_PER_ROW);

    return (
        <div className={`hand-section ${isHidden ? 'hidden' : ''}`}>
            <div className="player-hand-layout-container">
                <div className="left-button-panel" >
                    <div style={{ display: leftHanded ? 'block' : 'none' }} >
                        <PileButton
                            onClick={handlePickTile}
                            disabled={false}
                        />

                        <div className="sorting-buttons">
                            <Button
                                onClick={() => applySort('value')}
                                style={{marginBottom: '10px'}}
                                className={'swap-sort-button'}>
                                {t('sort-value')}
                            </Button>
                            <Button
                                onClick={() => applySort('color')}
                                style={{marginBottom: '10px'}}
                                className={'swap-sort-button'}>
                                {t('sort-colour')}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='player-hand'>
                    <div className={'player-hand-line'}></div>
                    <div className="first-row"
                         style={{display: 'flex', width: 'fit-content', justifyContent: 'center'}}>
                        {firstRowTiles.map((tile, index) => (
                            <TileSlot
                                key={`first-${index}`}
                                index={index}
                                tile={tile}
                                moveTile={moveTile}
                                moveTileInHand={moveTileInHand}
                                isDraggingEnabled={isDraggingEnabled}
                            />
                        ))}
                    </div>
                    <div className="second-row"
                         style={{display: 'flex', width: 'fit-content', justifyContent: 'center'}}>
                        {secondRowTiles.map((tile, index) => (
                            <TileSlot
                                key={`second-${index}`}
                                index={index + SLOTS_PER_ROW}
                                tile={tile}
                                moveTile={moveTile}
                                moveTileInHand={moveTileInHand}
                                isDraggingEnabled={isDraggingEnabled}
                            />
                        ))}
                    </div>
                </div>
                <div className="right-button-panel" >
                    <div style={{ display: leftHanded ? 'none' : 'block' }}>
                        <PileButton
                            onClick={handlePickTile}
                            disabled={false}
                        />

                        <div className="sorting-buttons">
                            <Button
                                onClick={() => applySort('value')}
                                style={{marginBottom: '10px'}}
                                className={'swap-sort-button'}>
                                {t('sort-value')}
                            </Button>
                            <Button
                                onClick={() => applySort('color')}
                                style={{marginBottom: '10px'}}
                                className={'swap-sort-button'}>
                                {t('sort-colour')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TileSlot = ({index, tile, moveTile, moveTileInHand, isDraggingEnabled}) => {
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'tile',
        drop: (item) => {
            if (isDraggingEnabled) {
                if (item.location === 'hand') {
                    moveTileInHand(item.id, index);
                } else if (item.location === 'board') {
                    moveTile(item.id, item.location, 'hand', index);
                }
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [moveTile, moveTileInHand, isDraggingEnabled, index]);

    return (
        <div
            ref={drop}
            className="tile-slot"
            style={{
                backgroundColor: isOver ? '#ddd' : 'transparent',
                width: '40px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed #aaa',
                marginLeft: '10px',
                marginRight: '10px',
                marginBottom: '10px',
                marginTop: '20px'
            }}
        >
            {tile ? (
                <Tile
                    key={tile.id}
                    id={tile.id}
                    color={tile.color}
                    value={tile.value}
                    location="hand"
                    moveTile={moveTile}
                    isDraggingEnabled={isDraggingEnabled}
                />
            ) : (
                <div className="empty-slot" style={{ width: '50px', height: '70px' }} />
            )}
        </div>
    );
};

export default PlayerHand;