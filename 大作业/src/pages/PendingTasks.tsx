import React, { useState, useEffect } from 'react';
import { Button, Empty, Space, DatePicker, message, Input, Tag, Dropdown, Menu, Drawer, Form } from 'antd';
import { PlusOutlined, SearchOutlined, SortAscendingOutlined, CalendarOutlined, DownOutlined } from '@ant-design/icons';
import TaskItem from '../components/TaskItem';
import { Task, TaskStatus } from '../types';
import { TaskStorage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import dayjs from 'dayjs';

const { Search } = Input;
const { TextArea } = Input;

const PendingTasks: React.FC = () => {
    const { primaryColor, activeColor } = useTheme();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState<'startTime' | 'endTime'>('endTime');
    const [activeTab, setActiveTab] = useState('all');

    // 创建任务相关状态
    const [isCreating, setIsCreating] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskEndTime, setNewTaskEndTime] = useState<dayjs.Dayjs | null>(null);

    // Drawer相关状态
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        filterAndSortTasks();
    }, [tasks, searchText, sortBy, activeTab]);

    const loadTasks = () => {
        const pendingTasks = TaskStorage.getPendingTasks();
        setTasks(pendingTasks);
    };

    const filterAndSortTasks = () => {
        let filtered = [...tasks];
        const now = dayjs();
        const today = now.startOf('day');

        // 按标签筛选
        switch (activeTab) {
            case 'today':
                filtered = filtered.filter(task => {
                    const taskStart = dayjs(task.startTime).startOf('day');
                    return taskStart.isSame(today);
                });
                break;
            case 'todayDeadline':
                filtered = filtered.filter(task => {
                    const taskEnd = dayjs(task.endTime).startOf('day');
                    return taskEnd.isSame(today);
                });
                break;
            case 'overdue':
                filtered = filtered.filter(task => {
                    const taskEnd = dayjs(task.endTime);
                    return taskEnd.isBefore(now);
                });
                break;
            default:
                // 全部任务，不过滤
                break;
        }

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
                case 'endTime':
                    return dayjs(a.endTime).valueOf() - dayjs(b.endTime).valueOf();
                default:
                    return 0;
            }
        });

        setFilteredTasks(filtered);
    };

    const handleCreateTask = () => {
        if (!newTaskTitle.trim()) {
            message.error('请输入任务名称');
            return;
        }
        if (!newTaskEndTime) {
            message.error('请选择截止时间');
            return;
        }

        const newTask = {
            title: newTaskTitle.trim(),
            description: '',
            startTime: dayjs().toISOString(),
            endTime: newTaskEndTime.toISOString(),
            status: TaskStatus.PENDING
        };

        TaskStorage.addTask(newTask);
        loadTasks();

        // 重置表单
        setNewTaskTitle('');
        setNewTaskEndTime(null);
        setIsCreating(false);
        message.success('任务创建成功');
    };

    const handleQuickDate = (days: number) => {
        const targetDate = dayjs().add(days, 'day').hour(18).minute(0).second(0);
        setNewTaskEndTime(targetDate);
    };

    const handleDeleteTask = (id: string) => {
        TaskStorage.deleteTask(id);
        loadTasks();
    };

    const handleToggleStatus = (id: string) => {
        TaskStorage.updateTask(id, { status: TaskStatus.COMPLETED });
        loadTasks();
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        form.setFieldsValue({
            title: task.title,
            description: task.description || '',
            endTime: dayjs(task.endTime)
        });
        setDrawerVisible(true);
    };

    const handleSaveTask = async () => {
        try {
            const values = await form.validateFields();
            if (editingTask) {
                TaskStorage.updateTask(editingTask.id, {
                    title: values.title,
                    description: values.description,
                    endTime: values.endTime.toISOString()
                });
                loadTasks();
                setDrawerVisible(false);
                setEditingTask(null);
                message.success('任务更新成功');
            }
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const handleSortChange = (key: string) => {
        setSortBy(key as 'startTime' | 'endTime');
    };

    const sortMenu = (
        <Menu onClick={({ key }) => handleSortChange(key)}>
            <Menu.Item key="startTime" style={{ color: sortBy === 'startTime' ? '#1890ff' : undefined }}>
                按开始时间排序
            </Menu.Item>
            <Menu.Item key="endTime" style={{ color: sortBy === 'endTime' ? '#1890ff' : undefined }}>
                按截止时间排序
            </Menu.Item>
        </Menu>
    );

    const getTabConfig = (key: string) => {
        const configs = {
            all: { color: primaryColor, label: '全部' },
            today: { color: '#52c41a', label: '今日任务' },
            todayDeadline: { color: '#fa8c16', label: '今日截止' },
            overdue: { color: '#ff4d4f', label: '已截止' }
        };
        return configs[key as keyof typeof configs] || configs.all;
    };

    const getSortText = () => {
        switch (sortBy) {
            case 'startTime':
                return '开始时间';
            case 'endTime':
                return '截止时间';
            default:
                return '排序';
        }
    };

    return (
        <div>
            {/* 筛选和搜索区域 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                flexWrap: 'wrap',
                gap: 16
            }}>
                {/* 标签筛选栏 */}
                <Space size={6}>
                    {['all', 'today', 'todayDeadline', 'overdue'].map(key => {
                        const config = getTabConfig(key);
                        return (
                            <Tag
                                key={key}
                                color={config.color}
                                style={{
                                    cursor: 'pointer',
                                    padding: '2px 8px',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    border: 'none',
                                    borderRadius: 4,
                                    opacity: activeTab === key ? 1 : 0.6,
                                    transform: activeTab === key ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    minWidth: 'auto',
                                    height: 24,
                                    lineHeight: '20px'
                                }}
                                onClick={() => setActiveTab(key)}
                            >
                                {config.label}
                            </Tag>
                        );
                    })}
                </Space>

                {/* 搜索和排序 */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
            </div>

            {/* 任务操作区 */}
            <div className="task-creation-area" style={{
                background: '#fff',
                padding: 16,
                borderRadius: 6,
                marginBottom: 16,
                border: '1px solid #e8e8e8',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
                {/* 任务名称输入框 */}
                <div style={{ marginBottom: isCreating ? 12 : 0 }}>
                    <Input
                        placeholder="添加新任务..."
                        prefix={<PlusOutlined style={{ color: '#1890ff' }} />}
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onFocus={() => setIsCreating(true)}
                        onPressEnter={handleCreateTask}
                        style={{
                            fontSize: 14,
                            borderRadius: 6,
                            border: '1px solid #e8e8e8'
                        }}
                    />
                </div>

                {/* 截止日期选择区 */}
                {isCreating && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        paddingTop: 12,
                        borderTop: '1px solid #f0f0f0',
                        animation: 'slideDown 0.3s ease-out'
                    }}>
                        {/* 快捷日期标签 */}
                        <Space size={6}>
                            <Button
                                size="small"
                                onClick={() => handleQuickDate(0)}
                                type={newTaskEndTime?.isSame(dayjs().hour(18).minute(0).second(0), 'day') ? 'primary' : 'default'}
                                style={{ fontSize: 12, height: 24, padding: '0 8px' }}
                            >
                                今天
                            </Button>
                            <Button
                                size="small"
                                onClick={() => handleQuickDate(1)}
                                type={newTaskEndTime?.isSame(dayjs().add(1, 'day').hour(18).minute(0).second(0), 'day') ? 'primary' : 'default'}
                                style={{ fontSize: 12, height: 24, padding: '0 8px' }}
                            >
                                明天
                            </Button>
                            <Button
                                size="small"
                                onClick={() => handleQuickDate(2)}
                                type={newTaskEndTime?.isSame(dayjs().add(2, 'day').hour(18).minute(0).second(0), 'day') ? 'primary' : 'default'}
                                style={{ fontSize: 12, height: 24, padding: '0 8px' }}
                            >
                                后天
                            </Button>
                            <Button
                                size="small"
                                onClick={() => handleQuickDate(7)}
                                type={newTaskEndTime?.isSame(dayjs().add(7, 'day').hour(18).minute(0).second(0), 'day') ? 'primary' : 'default'}
                                style={{ fontSize: 12, height: 24, padding: '0 8px' }}
                            >
                                一周后
                            </Button>
                        </Space>

                        {/* 自定义日期选择 */}
                        <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="MM-DD HH:mm"
                            placeholder="选择截止时间"
                            value={newTaskEndTime}
                            onChange={setNewTaskEndTime}
                            suffixIcon={<CalendarOutlined />}
                            size="small"
                            style={{ minWidth: 140 }}
                        />

                        {/* 操作按钮 */}
                        <Space style={{ marginLeft: 'auto' }} size={6}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewTaskTitle('');
                                    setNewTaskEndTime(null);
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                onClick={handleCreateTask}
                                disabled={!newTaskTitle.trim() || !newTaskEndTime}
                            >
                                添加
                            </Button>
                        </Space>
                    </div>
                )}
            </div>

            {/* 任务列表区 */}
            {filteredTasks.length === 0 ? (
                <Empty
                    description={tasks.length === 0 ? "暂无待完成任务" : "没有找到匹配的任务"}
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
                        />
                    ))}
                </div>
            )}

            {/* 编辑任务Drawer */}
            <Drawer
                title="编辑任务"
                placement="right"
                width={400}
                onClose={() => {
                    setDrawerVisible(false);
                    setEditingTask(null);
                }}
                open={drawerVisible}
                extra={
                    <Space>
                        <Button onClick={() => setDrawerVisible(false)}>取消</Button>
                        <Button type="primary" onClick={handleSaveTask}>保存</Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="任务名称"
                        rules={[{ required: true, message: '请输入任务名称' }]}
                    >
                        <Input placeholder="请输入任务名称" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="任务描述"
                    >
                        <TextArea rows={4} placeholder="请输入任务描述（可选）" />
                    </Form.Item>

                    <Form.Item
                        name="endTime"
                        label="截止时间"
                        rules={[{ required: true, message: '请选择截止时间' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="选择截止时间"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default PendingTasks;