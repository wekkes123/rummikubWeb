import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Typography, Space, ConfigProvider, Input, Form } from 'antd';
import {ArrowLeftOutlined, PlayCircleOutlined, ReadOutlined, SettingOutlined} from '@ant-design/icons';
import nlFlag from "../images/Flag_of_Belgium.png";
import ukFlag from "../images/Flag_of_the_United_Kingdom.png";

const { Content } = Layout;
const { Title } = Typography;

const Registration = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

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
                            />

                            <Input
                                placeholder={t('email')}
                                size="large"
                                style={{ height: 50 }}
                            />
                        </Space>
                    </Form>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default Registration;