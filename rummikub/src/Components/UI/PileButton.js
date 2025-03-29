import React from 'react';
import '../../css/button.css';
import { useTranslation } from 'react-i18next';
import pile from '../../images/draw-pile.png';

const PileButton = ({
                        onClick,
                        className = '',
                        disabled = false
                    }) => {
    const { t } = useTranslation();
    const combinedClassName = `pile-button ${className} ${disabled ? 'disabled' : ''}`;

    return (
        <button onClick={onClick} disabled={disabled} className={combinedClassName}>
            <img src={pile} alt="Pick tile from pile" className="pile-button-img" />
            <div className="take-tile">{t('pile')}</div>
        </button>
    );
};

export default PileButton;
