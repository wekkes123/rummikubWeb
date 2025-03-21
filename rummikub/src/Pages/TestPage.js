import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CPUOpponent from '../Components/RummikubAPItest';
import TilePicker from '../Components/TilePicker';

function TestPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cpuStatus, setCpuStatus] = useState("Waiting for move...");

    // State to enable/disable dragging functionality
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);

    const showHelp = () => setIsModalVisible(true);
    const handleOk = () => setIsModalVisible(false);

    const handleCPUMove = (move) => {
        if (move) {
            setCpuStatus("CPU played a move!");
        } else {
            setCpuStatus("CPU has no valid move and must draw a tile.");
        }
    };

    // Toggle drag functionality (similar to GameComponent)
    const toggleDragging = useCallback(() => {
        setIsDraggingEnabled(prev => !prev);
    }, []);

    return (
        <div style={{ backgroundColor: '#58B4D1', padding: "20px" }}>
            <h1>This is the Test Page</h1>
            <p>Content for the test page goes here.</p>

                {/* Drag functionality toggle */}
                <div className="controls">
                    <button
                        className={`toggle-button ${isDraggingEnabled ? 'enabled' : 'disabled'}`}
                        onClick={toggleDragging}
                    >
                        Dragging is {isDraggingEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>

                {/* Rummikub Tile Picker with Dragging functionality */}
                <TilePicker isDraggingEnabled={isDraggingEnabled} />

            {/* Display CPU Status */}
            <h2>CPU Status: {cpuStatus}</h2>

            {/* CPU Opponent Component */}
            <CPUOpponent
                rack={["r1", "r2", "r3"]} // Example tiles
                table={["r4", "r5", "r6"]} // Example sets on table
                isFirstMove={false}
                onMoveMade={handleCPUMove}
            />

            {/* Help Button */}
            <Button
                type="primary"
                shape="square"
                icon={<QuestionCircleOutlined style={{ fontSize: '30px', color: '#fff' }} />}
                size="large"
                onClick={showHelp}
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

            {/* Help Modal */}
            <Modal
                title="Help: Game Rules & Website Purpose"
                onOk={handleOk}
                visible={isModalVisible}
                onCancel={handleOk}
                okText="Close"
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
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
