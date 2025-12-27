import React, { useState, useEffect } from 'react';
import { Empty, Input, Dropdown, Menu, Button } from 'antd';
import { SearchOutlined, SortAscendingOutlined, DownOutlined } from '@ant-design/icons';
import TaskItem from '../components/TaskItem';
import { Task, TaskStatus } from '../types';
import { TaskStorage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import dayjs from 'dayjs';

const { Search } = Input;

const CompletedTasks: React.FC = () => {
    const { primaryColor } = useTheme();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState<'startTime' | 'completedTime'>('completedTime');

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        filterAndSortTasks();
    }, [tasks, searchText, sortBy]);

    const loadTasks = () => {
        const completedTasks = TaskStorage.getCompletedTasks();
        setTasks(completedTasks);
    };

    const filterAndSortTasks = () => {
        let filtered = [...tasks];

        // 按搜索文本过滤
        if (searchText) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchText.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        // 排序
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'startTime':
                    return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
                case 'completedTime':
                    return dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf();
                default:
                    return 0;
            }
        });

        setFilteredTasks(filtered);
    };

    const handleEditTask = (task: Task) => {
        // 已完成任务不支持编辑，这里可以留空或者显示提示
        console.log('已完成任务不支持编辑');
    };

    const handleDeleteTask = (id: string) => {
        TaskStorage.deleteTask(id);
        loadTasks();
    };

    const handleToggleStatus = (id: string) => {
        // 已完成任务可以重新标记为待完成
        TaskStorage.updateTask(id, { status: TaskStatus.PENDING });
        loadTasks();
    };

    const handleSortChange = (key: string) => {
        setSortBy(key as 'startTime' | 'completedTime');
    };

    const sortMenu = (
        <Menu onClick={({ key }) => handleSortChange(key)}>
            <Menu.Item key="startTime" style={{ color: sortBy === 'startTime' ? '#1890ff' : undefined }}>
                按开始时间排序
            </Menu.Item>
            <Menu.Item key="completedTime" style={{ color: sortBy === 'completedTime' ? '#1890ff' : undefined }}>
                按完成时间排序
            </Menu.Item>
        </Menu>
    );

    const getSortText = () => {
        switch (sortBy) {
            case 'startTime':
                return '开始时间';
            case 'completedTime':
                return '完成时间';
            default:
                return '排序';
        }
    };

    return (
        <div>
            {/* 搜索和排序区域 */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: 20,
                gap: 12
            }}>
                <Search
                    placeholder="搜索任务..."
                    allowClear
                    style={{ width: 280 }}
                    onChange={(e) => setSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                />
                <Dropdown overlay={sortMenu} trigger={['hover']} placement="bottomRight">
                    <Button
                        icon={<SortAscendingOutlined />}
                        style={{ minWidth: 100 }}
                    >
                        {getSortText()} <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            {/* 任务列表区 */}
            {filteredTasks.length === 0 ? (
                <Empty
                    description={tasks.length === 0 ? "暂无已完成任务" : "没有找到匹配的任务"}
                    style={{ marginTop: 40 }}
                />
            ) : (
                <div className="task-list">
                    {filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onToggleStatus={handleToggleStatus}
                            isCompleted={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedTasks;