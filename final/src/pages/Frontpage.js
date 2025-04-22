import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Typography, Space, ConfigProvider } from 'antd';
import { PlayCircleOutlined, QuestionCircleOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons';
import LanguageButtons from '../components/LanguageButtons';
import HelpModal from '../components/RulesModal';

const { Content } = Layout;
const { Title } = Typography;

const FrontPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showHelp = () => {
        setIsModalVisible(true);
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
                <Space
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        zIndex: 1
                    }}
                >
                    <Button
                        type="primary"
                        shape="square"
                        icon={<QuestionCircleOutlined style={{ fontSize: '70px', color: '#fff' }} />}
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
                            backgroundColor: '#FFB703',
                            borderColor: '#e6f7ff',
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
                            marginBottom: 48,
                        }}
                        onClick={() => navigate('/registration')}
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
                        onClick={() => navigate('/settings')}
                    >
                        {t('settings')}
                    </Button>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default FrontPage;