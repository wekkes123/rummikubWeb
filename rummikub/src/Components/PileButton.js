import React from 'react';
import '../css/button.css';
import { useTranslation } from 'react-i18next';
import pile from '../images/pile-bag.png'

const PileButton = ({
                         onClick,
                         className = '',
                         disabled = false
                     }) => {
    const { t, i18n } = useTranslation();
    const combinedClassName = `pile-button ${className} ${disabled ? 'disabled' : ''}`;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
        >
            <div className="take-tile">
                {t('pile')}
            </div>
        <img
            src = {pile}
            alt = "Pick tile from pile"
            className="pile-button-img"
        />
        </button>
    );
};

export default PileButton;