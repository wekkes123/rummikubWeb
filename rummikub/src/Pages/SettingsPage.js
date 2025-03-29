import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Typography, Space, ConfigProvider, Switch } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import LanguageButtons from '../Components/UI/LanguageButtons';

const { Content } = Layout;
const { Title } = Typography;

const SettingsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Load saved setting from localStorage (default: right-handed)
    const savedHandPreference = localStorage.getItem('handPreference') === 'left';
    const [isLeftHanded, setIsLeftHanded] = useState(savedHandPreference);

    // Save setting when toggled
    useEffect(() => {
        localStorage.setItem('handPreference', isLeftHanded ? 'left' : 'right');
    }, [isLeftHanded]);

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
                    <Title style={{
                        fontSize: 48,
                        marginBottom: 70,
                        color: 'black',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {t('settings')}
                    </Title>

                    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Title level={4} style={{ margin: 0 }}>{t('Right-Handed')}</Title>
                        <Switch
                            checked={!isLeftHanded}
                            onChange={() => setIsLeftHanded(!isLeftHanded)}
                            checkedChildren={<span style={{ fontSize: '16px' }}>{t('yes')}</span>}
                            unCheckedChildren={<span style={{ fontSize: '16px' }}>{t('no')}</span>}
                        />
                    </div>

                    <Button type="primary" onClick={() => navigate('/dev')} style={{ marginBottom: 10 }}>
                        {t('Developer Settings')}
                    </Button>
                    <Button onClick={() => navigate('/')}>
                        {t('Go Back')}
                    </Button>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default SettingsPage;
