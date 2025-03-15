import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Typography, Space, ConfigProvider } from 'antd';
import { PlayCircleOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons';
import ukFlag from '../images/Flag_of_the_United_Kingdom.png';
import nlFlag from '../images/Flag_of_Belgium.png';

const { Content } = Layout;
const { Title } = Typography;

const FrontPage = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    // Get the full language name
    const getLanguageName = (code) => {
        switch(code) {
            case 'en': return 'English';
            case 'nl': return 'Nederlands';
            default: return code;
        }
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
                {/* Language buttons in top left */}
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
                    <Title style={{
                        fontSize: 48,
                        marginBottom: 70,
                        color: 'black',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Rummikub
                    </Title>


                        <Button
                            type="primary"
                            size="large"
                            icon={<PlayCircleOutlined />}
                            block
                            style={{
                                height: 50,
                                width: 240,
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'black',
                                marginBottom: 48, //This is the minimum for elderly users with bad motor skills
                            }}
                        >
                            {t('start')}
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            icon={<ReadOutlined />}
                            block
                            style={{
                                height: 50,
                                width: 240,
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'black',
                                marginBottom: 48,
                            }}
                        >
                            {t('tutorial')}
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            icon={<SettingOutlined />}
                            block
                            style={{
                                height: 50,
                                width: 240,
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'black',
                                marginBottom: 48,
                            }}
                        >
                            {t('settings')}
                        </Button>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default FrontPage;