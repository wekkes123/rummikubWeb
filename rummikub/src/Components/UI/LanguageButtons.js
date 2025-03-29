import React from 'react';
import { Button } from 'antd';
import ukFlag from '../../images/Flag_of_the_United_Kingdom.png';
import nlFlag from '../../images/Flag_of_Belgium.png';
import { useTranslation } from 'react-i18next';

const LanguageButtons = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    return (
        <div style={{ display: 'flex' }}> {/* Wrap buttons in a flex container */}
            <Button
                onClick={() => changeLanguage('nl')}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'auto',
                    padding: '8px',
                    backgroundColor: i18n.language === 'nl' ? '#e6f7ff' : undefined,
                    borderColor: i18n.language === 'nl' ? '#FFB703' : undefined,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    marginRight: '40px',
                }}
            >
                <img
                    src={nlFlag}
                    alt="Nederlands"
                    style={{ height: 40, marginBottom: 4 }}
                />
                <span style={{ fontSize: 16 }}>Nederlands</span>
            </Button>

            <Button
                onClick={() => changeLanguage('en')}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'auto',
                    padding: '8px',
                    backgroundColor: i18n.language === 'en' ? '#e6f7ff' : undefined,
                    borderColor: i18n.language === 'en' ? '#FFB703' : undefined,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                }}
            >
                <img
                    src={ukFlag}
                    alt="English"
                    style={{ height: 40, marginBottom: 4 }}
                />
                <span style={{ fontSize: 16 }}>English</span>
            </Button>
        </div>
    );
};

export default LanguageButtons;