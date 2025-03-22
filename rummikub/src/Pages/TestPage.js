import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CPUOpponent from '../Components/RummikubAPItest';
import TilePicker from '../Components/TilePicker';
import TileSorter from '../Components/Sort';
import Tile from '../Components/Tile';
import TileData from '../Components/TileData';

function TestPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cpuStatus, setCpuStatus] = useState("Waiting for move...");
    const [sortBy, setSortBy] = useState("number");

    const tiles = TileData

    const sortedTiles = TileSorter({ tiles, sortby: sortBy });

    return (
        <div style={{ backgroundColor: '#58B4D1', padding: "20px" }}>
            <h1>This is the Test Page</h1>

            <TilePicker />

            <h3>Sorting by: {sortBy}</h3>
            <Button onClick={() => setSortBy(sortBy === "color" ? "number" : "color")}>
                Toggle Sort
            </Button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {sortedTiles.map((tile, index) => (
                    <Tile key={index} {...tile} isDraggingEnabled={true} />
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
    );
}

export default TestPage;
