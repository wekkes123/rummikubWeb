import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * creates a functional help button visual
 * @param isVisible
 * @param onClose
 * @returns {*}
 * @constructor
 */
const HelpModal = ({ isVisible, onClose }) => {
    const { t } = useTranslation();

    return (
        <Modal
            title={t('help-modal-title')}
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="ok" type="primary" onClick={onClose}>
                    {t('close')}
                </Button>
            ]}
        >
            <h3>{t('game-rules')}</h3>
            <ul>
                <li>{t('rules-des-1')}</li>
                <li>{t('rules-des-2')}</li>
                <li>{t('rules-des-3')}</li>
                <li>{t('rules-des-4')}</li>
                <li>{t('rules-des-5')}</li>
            </ul>

            <h3>{t('website-purpose')}</h3>
            <p>{t('website-description')}</p>
        </Modal>
    );
};

export default HelpModal;
