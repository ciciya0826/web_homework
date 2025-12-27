import React, { useState, useEffect } from 'react';
import { Menu, Button, Dropdown, Space } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { PageType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { TaskStorage, UserStorage } from '../utils/storage';

interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onLogout }) => {
    const { primaryColor } = useTheme();
    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(UserStorage.getCurrentUser());

    useEffect(() => {
        // 计算任务数量
        const updateTaskCounts = () => {
            const pendingTasks = TaskStorage.getPendingTasks();
            const completedTasks = TaskStorage.getCompletedTasks();
            setPendingCount(pendingTasks.length);
            setCompletedCount(completedTasks.length);
        };

        updateTaskCounts();

        // 监听存储变化
        const handleStorageChange = () => {
            updateTaskCounts();
        };

        // 监听自定义任务更新事件
        const handleTaskUpdate = () => {
            updateTaskCounts();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('tasksUpdated', handleTaskUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tasksUpdated', handleTaskUpdate);
        };
    }, []);

    const handleLogout = () => {
        UserStorage.logout();
        onLogout();
    };

    // 渲染任务数量徽章
    const renderTaskCount = (count: number) => {
        if (count === 0) return null;
        return (
            <span
                style={{
                    backgroundColor: 'white',
                    color: primaryColor,
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginLeft: '8px',
                    minWidth: '20px',
                    border: `1px solid ${primaryColor}`
                }}
            >
                {count > 99 ? '99+' : count}
            </span>
        );
    };

    const menuItems = [
        {
            key: PageType.PENDING,
            icon: <ClockCircleOutlined />,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>待完成任务</span>
                    {renderTaskCount(pendingCount)}
                </div>
            )
        },
        {
            key: PageType.COMPLETED,
            icon: <CheckCircleOutlined />,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>已完成任务</span>
                    {renderTaskCount(completedCount)}
                </div>
            )
        },
        {
            key: PageType.STATISTICS,
            icon: <BarChartOutlined />,
            label: '数据统计'
        },
        {
            key: PageType.SETTINGS,
            icon: <SettingOutlined />,
            label: '设置'
        }
    ];

    const userMenu = (
        <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="sidebar">
            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
                <h2 style={{ color: primaryColor, textAlign: 'center' }}>待办工作台</h2>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[currentPage]}
                items={menuItems}
                onClick={({ key }) => onPageChange(key as PageType)}
                style={{ border: 'none', background: 'transparent' }}
            />

            {/* 用户信息区域 */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                borderTop: '1px solid #e8e8e8',
                paddingTop: '16px'
            }}>
                <Dropdown overlay={userMenu} trigger={['click']} placement="topLeft">
                    <Button
                        type="text"
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            height: 'auto',
                            padding: '8px 12px'
                        }}
                    >
                        <Space>
                            <UserOutlined style={{ color: primaryColor }} />
                            <span style={{ color: '#333' }}>{currentUser?.username}</span>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default Sidebar;