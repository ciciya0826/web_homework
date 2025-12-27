import { Task, AppSettings, TaskStatus, User } from '../types';

// 本地存储键名
const STORAGE_KEYS = {
    TASKS: 'todo_tasks',
    SETTINGS: 'todo_settings',
    USERS: 'todo_users',
    CURRENT_USER: 'todo_current_user'
};

// 任务存储工具类
export class TaskStorage {
    // 获取所有任务
    static getTasks(): Task[] {
        const tasksJson = localStorage.getItem(STORAGE_KEYS.TASKS);
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    // 保存任务列表
    static saveTasks(tasks: Task[]): void {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        // 触发自定义事件通知组件更新
        window.dispatchEvent(new CustomEvent('tasksUpdated'));
    }

    // 添加新任务
    static addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
        const tasks = this.getTasks();
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    }

    // 更新任务
    static updateTask(id: string, updates: Partial<Task>): Task | null {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) return null;

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveTasks(tasks);
        return tasks[taskIndex];
    }

    // 删除任务
    static deleteTask(id: string): boolean {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);

        if (filteredTasks.length === tasks.length) return false;

        this.saveTasks(filteredTasks);
        return true;
    }

    // 获取待完成任务
    static getPendingTasks(): Task[] {
        return this.getTasks().filter(task => task.status === TaskStatus.PENDING);
    }

    // 获取已完成任务
    static getCompletedTasks(): Task[] {
        return this.getTasks().filter(task => task.status === TaskStatus.COMPLETED);
    }
}

// 设置存储工具类
export class SettingsStorage {
    // 获取应用设置
    static getSettings(): AppSettings {
        const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settingsJson ? JSON.parse(settingsJson) : {
            theme: {
                primaryColor: '#7ce5ef',
                activeColor: '#f4bff4',
                borderRadius: 20
            },
            language: 'zh-CN'
        };
    }

    // 保存应用设置
    static saveSettings(settings: AppSettings): void {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
}

// 用户存储工具类
export class UserStorage {
    // 获取所有用户
    static getUsers(): User[] {
        try {
            const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            console.error('获取用户数据失败:', error);
            return [];
        }
    }

    // 保存用户列表
    static saveUsers(users: User[]): void {
        try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (error) {
            console.error('保存用户数据失败:', error);
        }
    }

    // 用户注册
    static register(username: string, password: string): User | null {
        try {
            const users = this.getUsers();
            const trimmedUsername = username.trim();

            // 检查用户名是否已存在
            const existingUser = users.find(user => user.username === trimmedUsername);
            if (existingUser) {
                console.log('用户名已存在:', trimmedUsername);
                return null;
            }

            const newUser: User = {
                id: Date.now().toString(),
                username: trimmedUsername,
                email: '',
                password: password,
                createdAt: new Date().toISOString()
            };

            console.log('创建新用户:', { username: newUser.username, password: newUser.password });
            users.push(newUser);
            this.saveUsers(users);

            // 验证保存是否成功
            const savedUsers = this.getUsers();
            const savedUser = savedUsers.find(u => u.username === trimmedUsername);
            console.log('保存后验证:', savedUser);

            // 自动登录
            this.setCurrentUser(newUser);

            return newUser;
        } catch (error) {
            console.error('注册失败:', error);
            return null;
        }
    }

    // 用户登录
    static login(username: string, password: string): User | null {
        try {
            const users = this.getUsers();
            const trimmedUsername = username.trim();

            console.log('登录尝试:', { username: trimmedUsername, password });
            console.log('现有用户:', users.map(u => ({ username: u.username, password: u.password })));

            const user = users.find(u =>
                u.username === trimmedUsername && u.password === password
            );

            console.log('匹配结果:', user ? '成功' : '失败');

            if (user) {
                this.setCurrentUser(user);
                return user;
            }

            return null;
        } catch (error) {
            console.error('登录失败:', error);
            return null;
        }
    }

    // 设置当前用户
    static setCurrentUser(user: User): void {
        try {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } catch (error) {
            console.error('设置当前用户失败:', error);
        }
    }

    // 获取当前用户
    static getCurrentUser(): User | null {
        try {
            const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('获取当前用户失败:', error);
            return null;
        }
    }

    // 用户退出
    static logout(): void {
        try {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } catch (error) {
            console.error('退出登录失败:', error);
        }
    }

    // 检查是否有用户注册过
    static hasUsers(): boolean {
        return this.getUsers().length > 0;
    }

    // 检查是否已登录
    static isLoggedIn(): boolean {
        return this.getCurrentUser() !== null;
    }

    // 清除所有用户数据（调试用）
    static clearAllUsers(): void {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        console.log('已清除所有用户数据');
    }
}