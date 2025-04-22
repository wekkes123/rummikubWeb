import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Space, ConfigProvider, Input, Form, Alert } from 'antd';
import { ArrowLeftOutlined, RotateRightOutlined} from '@ant-design/icons';
import LanguageButtons from "../components/LanguageButtons";

const { Content } = Layout;

const Registration = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
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

        if (!age.trim()) {
            newErrors.push(t('Please enter your age'));
        } else if (isNaN(age) || parseInt(age) <= 0) {
            newErrors.push(t('Please enter a valid age'));
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleFormSubmit = () => {
        if (validateForm()) {
            localStorage.setItem('username', username);
            localStorage.setItem('age', age);
            navigate('/game');
        }
    };

    const isFormValid = username.trim() && age.trim() && !isNaN(age) && parseInt(age) > 0;

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

                            <div style={{ fontWeight: 'bold', color: 'black' }}>{t('age')}:</div>
                            <Input
                                size="large"
                                style={{
                                    height: 50,
                                    color: 'black',
                                    fontWeight: 'bold',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                }}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                type="number"
                                min="1"
                            />
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