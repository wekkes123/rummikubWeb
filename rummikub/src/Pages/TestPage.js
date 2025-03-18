import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'; // Import icon

function TestPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showHelp = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ position: 'relative', height: '100vh', backgroundColor: '#87CEEB' }}> {/* Background for contrast */}
            <h1>This is the Test Page</h1>
            <p>Content for the test page goes here.</p>

            {/* Help Button with Icon filling the button and custom color */}
            <Button
                type="primary"
                shape="square"
                icon={<QuestionCircleOutlined style={{ fontSize: '30px', color: '#fff' }} />} // Icon style to fill button
                size="large"
                onClick={showHelp}
                style={{
                    position: 'absolute', // Positioning in the top left
                    top: '10px',
                    left: '10px',
                    width: '60px', // Set the width of the button
                    height: '60px', // Set the height of the button
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0, // Remove any padding
                    borderRadius: '10px', // Optional: Add rounded corners to the button
                    backgroundColor: '#FFB703', // Set button color
                    borderColor: '#FFB703', // Set button border color
                }}
            />

            {/* Rummikub Holder */}
            <div style={{
                position: 'absolute',
                bottom: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '120px',
                backgroundColor: '#E0E0E0',
                border: '2px solid black',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ width: '90%', height: '40%', backgroundColor: '#C0C0C0', marginBottom: '5px' }}></div>
                <div style={{ width: '90%', height: '40%', backgroundColor: '#C0C0C0' }}></div>
            </div>

            {/* Support Leg */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '60%',
                width: '10px',
                height: '50px',
                backgroundColor: 'black',
                transform: 'rotate(-10deg)'
            }}></div>

            {/* Modal displaying the rules and website purpose */}
            <Modal
                title="Help: Game Rules & Website Purpose"
                onOk={handleOk}
                visible={isModalVisible}
                onCancel={handleOk}  // Closes the modal on clicking the X button or outside the modal
                okText="Close"
                closable={true}  // Ensures that the X button is shown
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