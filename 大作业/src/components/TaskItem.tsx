import React from 'react';
import { Card, Tag, Button, Popconfirm } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Task, TaskStatus } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    isCompleted?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleStatus, isCompleted = false }) => {
    const { primaryColor } = useTheme();
    const isOverdue = dayjs().isAfter(dayjs(task.endTime)) && task.status === TaskStatus.PENDING;

    // 计算距离截止时间
    const getTimeUntilDeadline = () => {
        const now = dayjs();
        const deadline = dayjs(task.endTime);
        const diffInDays = deadline.diff(now, 'day');
        const diffInHours = deadline.diff(now, 'hour');

        if (diffInDays < 0) {
            return { text: '已逾期', urgent: true, color: '#ff4d4f' };
        } else if (diffInDays === 0) {
            if (diffInHours <= 0) {
                return { text: '已逾期', urgent: true, color: '#ff4d4f' };
            } else {
                return { text: `${diffInHours}小时后截止`, urgent: true, color: '#ff4d4f' };
            }
        } else if (diffInDays <= 3) {
            return { text: `${diffInDays}天后截止`, urgent: true, color: '#ff4d4f' };
        }

        return null;
    };

    const timeUntilDeadline = getTimeUntilDeadline();

    return (
        <Card
            className="task-card"
            style={{
                marginBottom: 12,
                borderLeft: `4px solid ${isOverdue ? '#ff4d4f' : primaryColor}`,
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            bodyStyle={{ padding: '16px 20px' }}
            hoverable
            onClick={() => onEdit(task)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* 任务核心信息 */}
                <div style={{ flex: 1, marginRight: 16 }}>
                    {/* 任务名称 */}
                    <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#262626',
                        lineHeight: 1.4
                    }}>
                        {task.title}
                    </h4>

                    {/* 任务详情 */}
                    {task.description && (
                        <p style={{
                            margin: '0 0 12px 0',
                            color: '#666',
                            fontSize: 14,
                            lineHeight: 1.5
                        }}>
                            {task.description}
                        </p>
                    )}

                    {/* 时间信息栏 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#8c8c8c', fontSize: 13 }}>开始时间</span>
                            <span style={{
                                background: `${primaryColor}20`, // 使用主题色的20%透明度
                                color: primaryColor,
                                padding: '3px 10px',
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500
                            }}>
                                {dayjs(task.startTime).format('MM-DD HH:mm')}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                                {isCompleted ? '完成时间' : '截止时间'}
                            </span>
                            <span style={{
                                background: isCompleted ? '#f6ffed' : (isOverdue ? '#fff2f0' : `${primaryColor}20`),
                                color: isCompleted ? '#52c41a' : (isOverdue ? '#ff4d4f' : primaryColor),
                                padding: '3px 10px',
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500
                            }}>
                                {isCompleted
                                    ? dayjs(task.updatedAt).format('MM-DD HH:mm')
                                    : dayjs(task.endTime).format('MM-DD HH:mm')
                                }
                            </span>
                            {/* 紧急提醒标签 - 只在未完成任务显示 */}
                            {!isCompleted && timeUntilDeadline && (
                                <Tag
                                    color={timeUntilDeadline.color}
                                    style={{
                                        margin: 0,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        animation: timeUntilDeadline.urgent ? 'pulse 2s infinite' : 'none'
                                    }}
                                >
                                    {timeUntilDeadline.text}
                                </Tag>
                            )}
                        </div>
                    </div>
                </div>

                {/* 操作按钮区 */}
                <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 80 }}
                    onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                >
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => onToggleStatus(task.id)}
                        style={{
                            height: 32,
                            fontSize: 12,
                            fontWeight: 500,
                            background: isCompleted ? '#fa8c16' : primaryColor,
                            borderColor: isCompleted ? '#fa8c16' : primaryColor
                        }}
                    >
                        {isCompleted ? '未完成' : '完成'}
                    </Button>
                    <Popconfirm
                        title="确定要删除这个任务吗？"
                        onConfirm={() => onDelete(task.id)}
                        okText="确定"
                        cancelText="取消"
                        placement="topRight"
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{
                                height: 32,
                                fontSize: 12,
                                fontWeight: 500
                            }}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </Card>
    );
};

export default TaskItem;