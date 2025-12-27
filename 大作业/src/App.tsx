import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import PendingTasks from './pages/PendingTasks';
import CompletedTasks from './pages/CompletedTasks';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import { PageType, User } from './types';
import { UserStorage } from './utils/storage';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<PageType>(PageType.PENDING);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { primaryColor } = useTheme();

    useEffect(() => {
        // 检查用户登录状态
        const user = UserStorage.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            // 检查是否有用户注册过
            if (UserStorage.hasUsers()) {
                // 跳转到HTML登录页面
                window.location.href = '/login.html';
                return;
            } else {
                // 跳转到HTML注册页面
                window.location.href = '/register.html';
                return;
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        // 跳转到HTML登录页面
        window.location.href = '/login.html';
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case PageType.PENDING:
                return <PendingTasks />;
            case PageType.COMPLETED:
                return <CompletedTasks />;
            case PageType.STATISTICS:
                return <Statistics />;
            case PageType.SETTINGS:
                return <Settings />;
            default:
                return <PendingTasks />;
        }
    };

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ color: 'white', fontSize: '18px' }}>加载中...</div>
            </div>
        );
    }

    // 如果用户未登录，显示加载状态（因为会跳转到HTML页面）
    if (!currentUser) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ color: 'white', fontSize: '18px' }}>正在跳转到认证页面...</div>
            </div>
        );
    }

    // 用户已登录，显示主应用
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: primaryColor,
                },
            }}
        >
            <div className="app-container">
                <Sidebar
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onLogout={handleLogout}
                />
                <div className="main-content">
                    {renderCurrentPage()}
                </div>
            </div>
        </ConfigProvider>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;