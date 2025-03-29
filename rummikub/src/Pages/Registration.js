import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Typography, Space, ConfigProvider, Input, Form } from 'antd';
import {
    ArrowLeftOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import nlFlag from "../images/Flag_of_Belgium.png";
import ukFlag from "../images/Flag_of_the_United_Kingdom.png";
import HelpModal from "../Components/UI/RulesModal";

const { Content } = Layout;
const { Title } = Typography;

const Registration = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const handleBack = () => {
        navigate('/');
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showHelp = () => {
        setIsModalVisible(true);
    };

    const handleFormSubmit = () => {
        // Check if the username or age is empty
        if (!username.trim() || !age.trim()) {
            alert(t('Please enter both username and age')); // You can replace this with a custom error message
            return;
        }

        // Store username and age in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('age', age);

        // Navigate to another page after storing the data (optional)
        navigate('/game'); // Change '/nextPage' to your desired route
    };

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
                            borderStyle: 'solid'
                        }}
                    >
                        <img
                            src={nlFlag}
                            alt="Nederlands"
                            style={{height: 40, marginBottom: 4}}
                        />
                        <span style={{fontSize: 16}}>Nederlands</span>
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
                            borderStyle: 'solid'
                        }}
                    >
                        <img
                            src={ukFlag}
                            alt="English"
                            style={{height: 40, marginBottom: 4}}
                        />
                        <span style={{fontSize: 16}}>English</span>
                    </Button>
                </Space>
                <Space
                    style={{
                        position: 'absolute',
                        top: 100,
                        right: 20,
                        zIndex: 1
                    }}
                ><Button
                    type="primary"
                    shape="square"
                    icon={<QuestionCircleOutlined style={{ fontSize: '70px', color: '#fff' }} />} // Icon style to fill button
                    size="large"
                    onClick={showHelp}
                    style={{
                        height: 90,
                        width: 90,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: '#FFB703', // Set button color
                        borderColor: '#e6f7ff', // Set button border color
                    }}
                />
                    <HelpModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
                </Space>

                <Content style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '50px 16px',
                    marginBottom: '20vh',
                }}>

                    <Form style={{ width: '100%', maxWidth: 300 }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Input
                                placeholder={t('username')}
                                size="large"
                                style={{ height: 50 }}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <Input
                                placeholder={t('age')}
                                size="large"
                                style={{ height: 50 }}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </Space>

                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', marginTop: 20, color: 'black' }}
                            onClick={handleFormSubmit}
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