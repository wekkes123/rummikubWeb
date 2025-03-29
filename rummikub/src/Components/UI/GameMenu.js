import React, { useState } from 'react';
import { Menu, Button, Drawer } from 'antd';
import { HomeOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const GameMenu = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();


    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleMenuClick = (key) => {
        console.log(`Clicked on: ${key}`);
        setMenuVisible(false);
        if (key === 'home'){
            navigate('/');
        }
        else if (key === 'settings'){
            navigate('/dev');
        }
    };

    return (
        <>
            {/* Small button to open menu */}
            <Button
                type="primary"
                icon={<MenuOutlined />}
                onClick={toggleMenu}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 1000,
                }}
            />

            {/* Drawer (same dark theme) */}
            <Drawer
                placement="right"
                closable={true}
                onClose={toggleMenu}
                open={menuVisible}
                width={200}
                bodyStyle={{ background: '#001529', padding: 0 }} // Match dark theme
                drawerStyle={{ background: '#001529' }} // Match dark theme
            >
                <Menu
                    mode="vertical"
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    onClick={({ key }) => handleMenuClick(key)}
                >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        {t('home')}
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        {t('settings')}
                    </Menu.Item>
                </Menu>
            </Drawer>
        </>
    );
};

export default GameMenu;
