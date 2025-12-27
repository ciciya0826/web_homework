// 任务状态枚举
export enum TaskStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

// 用户接口定义
export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
}

// 任务接口定义
export interface Task {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

// 主题配置接口
export interface ThemeConfig {
    primaryColor: string;
    activeColor: string;
    borderRadius: number;
}

// 应用设置接口
export interface AppSettings {
    theme: ThemeConfig;
    language: string;
}

// 页面类型枚举
export enum PageType {
    PENDING = 'pending',
    COMPLETED = 'completed',
    STATISTICS = 'statistics',
    SETTINGS = 'settings'
}