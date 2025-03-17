import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {Layout, Button, Typography, Space, ConfigProvider, Modal} from 'antd';
import {PlayCircleOutlined, QuestionCircleOutlined, ReadOutlined, SettingOutlined} from '@ant-design/icons';
import ukFlag from '../images/Flag_of_the_United_Kingdom.png';
import nlFlag from '../images/Flag_of_Belgium.png';

const { Content } = Layout;
const { Title } = Typography;

const FrontPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showHelp = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
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
                    <Button
                        type="primary"
                        shape="square"
                        icon={<QuestionCircleOutlined style={{ fontSize: '50px', color: '#fff' }} />} // Icon style to fill button
                        size="large"
                        onClick={showHelp}
                        style={{
                            height: 90,
                            width: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '8px',
                            backgroundColor: '#FFB703', // Set button color
                            borderColor: '#e6f7ff', // Set button border color
                        }}
                    />
                    <Modal
                        title="Help: Game Rules & Website Purpose"
                        onOk={handleOk}
                        visible={isModalVisible}
                        onCancel={handleOk}  // Closes the modal on clicking the X button or outside the modal
                        okText="Close"
                        closable={true}  // Ensures that the X button is shown
                        footer={[
                            <Button key="ok" type="primary" onClick={handleOk}>
                                Close
                            </Button>
                        ]}
                    >
                        <h3>Game Rules:</h3>
                        <ul>
                            <li>Each player takes turns placing tiles on the board.</li>
                            <li>Tiles are placed in sets of numbers or colors.</li>
                            <li>The goal is to arrange all tiles in valid combinations.</li>
                            <li>The first move should have a commbined value of over 30.</li>
                            <li>Jokers can be used as substitutes for other tiles.</li>
                        </ul>

                        <h3>Website Purpose:</h3>
                        <p>This website is designed to allow users to play Rummikub online, track their progress, and learn about dementia detection through gameplay.</p>
                    </Modal>
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
                        >
                            {t('settings')}
                        </Button>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default FrontPage;