import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {Layout, Button, Space, ConfigProvider, Input, Form, Alert, DatePicker} from 'antd';
import { ArrowLeftOutlined, RotateRightOutlined} from '@ant-design/icons';
import LanguageButtons from "../components/LanguageButtons";
import ThreePartDatePicker from "../components/ThreePartDatePicker";
import dayjs from 'dayjs';

const { Content } = Layout;

const Registration = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [errors, setErrors] = useState([]);
    const [isLandscape, setIsLandscape] = useState(false);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            i18n.changeLanguage(savedLang);
        }

        // Check initial orientation
        checkOrientation();

        // Add event listener for orientation changes
        window.addEventListener('resize', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
        };
    }, [i18n]);

    const checkOrientation = () => {
        setIsLandscape(window.innerWidth > window.innerHeight);
    };

    const handleBack = () => {
        navigate('/');
    };

    const validateForm = () => {
        const newErrors = [];

        if (!username.trim()) {
            newErrors.push(t('Please enter a username'));
        }
        if (!birthday) {
            newErrors.push(t('Please enter your birthday'));
        } else {
            const calculatedAge = calculateAge(birthday);
            if (calculatedAge <= 0 || isNaN(calculatedAge)) {
                newErrors.push(t('Please enter a valid birthday'));
            }
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleFormSubmit = async () => {
        if (validateForm()) {
            const pseudonym = await hashUsernameAndBirthday(username, birthday);
            localStorage.setItem('pseudonym', pseudonym);
            localStorage.setItem('birthday', birthday.toString());
            const ageValue = calculateAge(birthday);
            localStorage.setItem('age', ageValue.toString());
            navigate('/game');
        }
    };

    const isFormValid = username.trim() && birthday && calculateAge(birthday) > 0;

    async function hashUsernameAndBirthday(username, birthday) {
        const encoder = new TextEncoder();
        const data = encoder.encode(username + birthday.format('YYYY-MM-DD'));
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function calculateAge(birthday) {
        if (!birthday) return null;
        const now = dayjs();
        const birthDate = dayjs(birthday);
        let age = now.year() - birthDate.year();
        if (
            now.month() < birthDate.month() ||
            (now.month() === birthDate.month() && now.date() < birthDate.date())
        ) {
            age--;
        }
        return age;
    }


    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#FFB703',
                    borderRadius: 8,
                },
            }}
        >
            <Layout style={{ minHeight: '100vh', backgroundColor: '#58B4D1', position: 'relative' }}>
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        color: 'black',
                        top: 20,
                        right: 20,
                        zIndex: 1,
                        fontWeight: 'bold'
                    }}
                >
                    {t('back')}
                </Button>

                <Space
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        zIndex: 1
                    }}
                >
                    <LanguageButtons />
                </Space>

                <Content style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '50px 16px',
                    marginBottom: '20vh',
                }}>
                    {!isLandscape && (
                        <Alert
                            message={
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <RotateRightOutlined style={{ marginRight: 8 }} />
                                    {t('Please rotate your device to landscape mode')}
                                </div>
                            }
                            type="warning"
                            showIcon={false}
                            style={{ marginBottom: 20, width: '100%', maxWidth: 300 }}
                        />
                    )}

                    {errors.length > 0 && (
                        <Alert
                            message={t('Please correct the following:')}
                            description={
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            }
                            type="error"
                            showIcon
                            style={{ marginBottom: 20, width: '100%', maxWidth: 300 }}
                        />
                    )}

                    <Form style={{ width: '100%', maxWidth: 300 }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ fontWeight: 'bold', color: 'black' }}>{t('username')}:</div>
                            <Input
                                size="large"
                                style={{
                                    height: 50,
                                    color: 'black',
                                    fontWeight: 'bold',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <div style={{ fontWeight: 'bold', color: 'black' }}>{t('birthday')}:</div>
                            <ThreePartDatePicker
                                value={birthday}
                                onChange={setBirthday}
                                t={t} // pass your translation function
                            />

                            {birthday && (
                                <div style={{ marginTop: 8, fontWeight: 'bold', color: 'black' }}>
                                    {t('Age')}: {calculateAge(birthday)}
                                </div>
                            )}

                        </Space>

                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '100%',
                                marginTop: 20,
                                color: 'black',
                                backgroundColor: isFormValid && isLandscape ? '#FFB703' : '#A0A0A0',
                                cursor: isFormValid && isLandscape ? 'pointer' : 'not-allowed'
                            }}
                            onClick={handleFormSubmit}
                            disabled={!isFormValid || !isLandscape}
                        >
                            {t('submit')}
                        </Button>
                    </Form>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default Registration;