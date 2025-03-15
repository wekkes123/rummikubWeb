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
        <div>
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
                    <li>The first move should have a commbined value of over 30.</li>
                    <li>Jokers can be used as substitutes for other tiles.</li>
                </ul>

                <h3>Website Purpose:</h3>
                <p>This website is designed to allow users to play Rummikub online, track their progress, and learn about dementia detection through gameplay.</p>
            </Modal>
        </div>
    );
}

export default TestPage;
