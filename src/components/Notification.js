import React from 'react';
import { Modal } from 'antd';

/**
 * makes a pop-up notification visual
 * @param message
 * @param isVisible
 * @param onClose
 * @returns {*}
 * @constructor
 */
export default function NotificationModal({ message, isVisible, onClose }) {
    return (
        <Modal
            className="notificationModal"
            open={isVisible}
            onCancel={onClose}

            footer={[
                <button
                    key="ok"
                    onClick={onClose}
                    className="modalClose"
                >
                    Ok
                </button>
            ]}
            centered
            closable={false}
            mask={false}
        >
            <h2 className="text-lg">{message}</h2>
        </Modal>
    );
}
