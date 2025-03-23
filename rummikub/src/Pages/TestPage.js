import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CPUOpponent from '../Components/RummikubAPItest';
import TilePicker from '../Components/TilePicker';
import TileSorter from '../Components/Sort';
import Tile from '../Components/Tile';
import TileData from '../Components/TileData';
import isValidMove from "../Components/MoveValidator";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function TestPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cpuStatus, setCpuStatus] = useState("Waiting for move...");
    const [sortBy, setSortBy] = useState("value");

    const tiles = TileData; // Assuming TileData contains the tile objects

    const sortedTiles = TileSorter({ tiles, sortby: sortBy });

    const moveTiles1 = [
        { value: 5, color: 'red' },
        { value: 6, color: 'red' },
        { value: 7, color: 'red' }
    ];

    const moveTiles2 = [
        { value: 1, color: 'blue' },
        { value: 1, color: 'red' },
        { value: 2, color: 'orange' }
    ];

    const moveTiles3 = [
        { value: 1, color: 'blue' },
        { value: 1, color: 'red' },
        { value: 'Joker', color: 'red' }
    ];

    const isMoveValid1 = isValidMove(moveTiles1); // Check if the first example move is valid
    const isMoveValid2 = isValidMove(moveTiles2); // Check if the second example move is valid
    const isMoveValid3 = isValidMove(moveTiles3); // Check if the third example move is valid

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ backgroundColor: '#58B4D1', padding: "20px" }}>
                <h1>This is the Test Page</h1>

                <TilePicker />

                <h3>Sorting by: {sortBy}</h3>
                <Button onClick={() => setSortBy(sortBy === "color" ? "value" : "color")}>
                    Toggle Sort
                </Button>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {sortedTiles.map((tile, index) => (
                        <Tile key={index} {...tile} isDraggingEnabled={true} />
                    ))}
                </div>


                {/* Display if the first move is valid or not */}
                <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    {isMoveValid1 ? "Move 1 (Run) is valid!" : "Move 1 (Run) is invalid."}
                </div>

                {/* Display the tiles for Move 1 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {moveTiles1.map((tile, index) => (
                        <Tile key={index} value={tile.value} color={tile.color} isDraggingEnabled={true}/>
                    ))}
                </div>

                <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    {isMoveValid2 ? "Move 2 (Group) is valid!" : "Move 2 (Group) is invalid."}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {moveTiles2.map((tile, index) => (
                        <Tile key={index} value={tile.value} color={tile.color} isDraggingEnabled={true}/>
                    ))}
                </div>

                <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    {isMoveValid3 ? "Move 3 is valid!" : "Move 3 is invalid."}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {moveTiles3.map((tile, index) => (
                        <Tile key={index} value={tile.value} color={tile.color} isDraggingEnabled={true}/>
                    ))}
                </div>

                <h2>CPU Status: {cpuStatus}</h2>

                <CPUOpponent
                    rack={["r1", "r2", "r3"]}
                    table={["r4", "r5", "r6"]}
                    isFirstMove={false}
                    onMoveMade={(move) => setCpuStatus(move ? "CPU played a move!" : "CPU has no valid move and must draw a tile.")}
                />

                <Button
                    type="primary"
                    shape="square"
                    icon={<QuestionCircleOutlined style={{ fontSize: '30px', color: '#fff' }} />}
                    size="large"
                    onClick={() => setIsModalVisible(true)}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 0,
                        borderRadius: '10px',
                        backgroundColor: '#FFB703',
                        borderColor: '#FFB703',
                    }}
                />

                <Modal
                    title="Help: Game Rules & Website Purpose"
                    visible={isModalVisible}
                    onOk={() => setIsModalVisible(false)}
                    onCancel={() => setIsModalVisible(false)}
                    okText="Close"
                    footer={[
                        <Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                >
                    <h3>Game Rules:</h3>
                    <ul>
                        <li>Each player takes turns placing tiles on the board.</li>
                        <li>Tiles are placed in sets of numbers or colors.</li>
                        <li>The goal is to arrange all tiles in valid combinations.</li>
                        <li>The first move should have a combined value of over 30.</li>
                        <li>Jokers can be used as substitutes for other tiles.</li>
                    </ul>

                    <h3>Website Purpose:</h3>
                    <p>This website is designed to allow users to play Rummikub online, track their progress, and learn about dementia detection through gameplay.</p>
                </Modal>

            </div>
        </DndProvider>
    );
}

export default TestPage;
