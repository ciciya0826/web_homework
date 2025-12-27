import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Statistic, Tabs } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Task, TaskStatus } from '../types';
import { TaskStorage } from '../utils/storage';

const Statistics: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [trendPeriod, setTrendPeriod] = useState<'week' | 'month'>('week');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        const allTasks = TaskStorage.getTasks();
        setTasks(allTasks);
    };

    // 计算统计数据
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length;
    const overdueTasks = tasks.filter(task =>
        task.status === TaskStatus.PENDING && dayjs().isAfter(dayjs(task.endTime))
    ).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 获取趋势数据
    const getTrendData = () => {
        if (trendPeriod === 'week') {
            const weekStart = dayjs().startOf('week');
            const weekData = [];
            for (let i = 0; i < 7; i++) {
                const date = weekStart.add(i, 'day');
                const dayTasks = tasks.filter(task =>
                    dayjs(task.createdAt).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                ).length;
                weekData.push({
                    date: date.format('MM/DD'),
                    tasks: dayTasks
                });
            }
            return weekData;
        } else {
            // 本月数据按3天为一个单位
            const monthStart = dayjs().startOf('month');
            const daysInMonth = monthStart.daysInMonth();
            const monthData = [];

            for (let i = 0; i < daysInMonth; i += 3) {
                const startDate = monthStart.add(i, 'day');
                const endDate = monthStart.add(Math.min(i + 2, daysInMonth - 1), 'day');

                // 计算这3天内的任务总数
                let periodTasks = 0;
                for (let j = 0; j < 3 && (i + j) < daysInMonth; j++) {
                    const date = monthStart.add(i + j, 'day');
                    periodTasks += tasks.filter(task =>
                        dayjs(task.createdAt).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                    ).length;
                }

                monthData.push({
                    date: `${startDate.format('DD')}-${endDate.format('DD')}`,
                    tasks: periodTasks
                });
            }
            return monthData;
        }
    };

    const trendData = getTrendData();

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <p style={{ color: '#666', margin: '0 0 16px 0' }}>
                    查看你的任务完成情况和统计数据
                </p>
            </div>

            {/* 主要统计卡片 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>总任务数</span>}
                            value={totalTasks}
                            prefix={<CalendarOutlined style={{ color: '#1890ff', fontSize: 28 }} />}
                            valueStyle={{ color: '#1890ff', fontSize: 36, fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>已完成</span>}
                            value={completedTasks}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 28 }} />}
                            valueStyle={{ color: '#52c41a', fontSize: 36, fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
                            boxShadow: '0 4px 12px rgba(250, 140, 22, 0.15)',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>待完成</span>}
                            value={pendingTasks}
                            prefix={<ClockCircleOutlined style={{ color: '#fa8c16', fontSize: 28 }} />}
                            valueStyle={{ color: '#fa8c16', fontSize: 36, fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.15)',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>已逾期</span>}
                            value={overdueTasks}
                            prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 28 }} />}
                            valueStyle={{ color: '#ff4d4f', fontSize: 36, fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 时间统计概览 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Card
                        title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>本周概览</span>}
                        style={{
                            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
                            border: 'none'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 40, fontWeight: 'bold', color: '#1890ff', marginBottom: 8 }}>
                                {trendPeriod === 'week' ? trendData.reduce((sum, item) => sum + item.tasks, 0) :
                                    tasks.filter(task => {
                                        const taskDate = dayjs(task.createdAt);
                                        const weekStart = dayjs().startOf('week');
                                        const weekEnd = dayjs().endOf('week');
                                        return taskDate.isAfter(weekStart.subtract(1, 'day')) && taskDate.isBefore(weekEnd.add(1, 'day'));
                                    }).length}
                            </div>
                            <div style={{ fontSize: 16, color: '#1890ff', marginBottom: 12 }}>
                                个任务
                            </div>
                            <div style={{ color: '#666', fontSize: 14 }}>
                                {dayjs().startOf('week').format('MM月DD日')} - {dayjs().endOf('week').format('MM月DD日')}
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>本月概览</span>}
                        style={{
                            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
                            border: 'none'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 40, fontWeight: 'bold', color: '#52c41a', marginBottom: 8 }}>
                                {tasks.filter(task =>
                                    dayjs(task.createdAt).format('YYYY-MM') === dayjs().format('YYYY-MM')
                                ).length}
                            </div>
                            <div style={{ fontSize: 16, color: '#52c41a', marginBottom: 12 }}>
                                个任务
                            </div>
                            <div style={{ color: '#666', fontSize: 14 }}>
                                {dayjs().format('YYYY年MM月')}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 完成率和任务趋势 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Card
                        title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>任务完成率</span>}
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            border: 'none'
                        }}
                    >
                        <div style={{ textAlign: 'center', position: 'relative' }}>
                            <Progress
                                type="circle"
                                percent={completionRate}
                                size={160}
                                strokeColor={{
                                    '0%': '#1890ff',
                                    '50%': '#36cfc9',
                                    '100%': '#52c41a',
                                }}
                                strokeWidth={10}
                                format={() => (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                                            {completionRate}%
                                        </div>
                                        <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                                            完成率
                                        </div>
                                    </div>
                                )}
                            />
                            <div style={{ marginTop: 20, color: '#666', fontSize: 16 }}>
                                已完成 <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{completedTasks}</span> / {totalTasks} 个任务
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={<span style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>任务趋势</span>}
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            border: 'none'
                        }}
                        extra={
                            <Tabs
                                size="small"
                                activeKey={trendPeriod}
                                onChange={(key) => setTrendPeriod(key as 'week' | 'month')}
                                items={[
                                    { key: 'week', label: '本周' },
                                    { key: 'month', label: '本月' }
                                ]}
                            />
                        }
                    >
                        <div style={{ padding: '20px 10px' }}>
                            <div style={{ position: 'relative', height: 200 }}>
                                <svg width="100%" height="200" style={{ overflow: 'visible' }}>
                                    {/* 网格线 */}
                                    {[0, 2, 4, 6, 8, 10].map((value, i) => (
                                        <line
                                            key={`grid-${i}`}
                                            x1="40"
                                            y1={40 + i * 25}
                                            x2="95%"
                                            y2={40 + i * 25}
                                            stroke="#f0f0f0"
                                            strokeWidth="1"
                                        />
                                    ))}

                                    {/* Y轴标签 */}
                                    {[0, 2, 4, 6, 8, 10].map((value, i) => (
                                        <text
                                            key={`y-label-${i}`}
                                            x="30"
                                            y={45 + (5 - i) * 25}
                                            fontSize="12"
                                            fill="#666"
                                            textAnchor="end"
                                        >
                                            {value}
                                        </text>
                                    ))}

                                    {/* 折线图 */}
                                    <polyline
                                        points={trendData.map((item, index) => {
                                            // 统一使用50px间距
                                            const x = 50 + (index * 50);
                                            const maxTasks = Math.max(...trendData.map(d => d.tasks), 2);
                                            const maxScale = Math.max(maxTasks, 10);
                                            const y = 165 - (item.tasks / maxScale) * 125;
                                            return `${x},${y}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="#52c41a"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* 数据点 */}
                                    {trendData.map((item, index) => {
                                        // 统一使用50px间距
                                        const x = 50 + (index * 50);
                                        const maxTasks = Math.max(...trendData.map(d => d.tasks), 2);
                                        const maxScale = Math.max(maxTasks, 10);
                                        const y = 165 - (item.tasks / maxScale) * 125;
                                        return (
                                            <g key={`point-${index}`}>
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="6"
                                                    fill="#52c41a"
                                                    stroke="#fff"
                                                    strokeWidth="2"
                                                />
                                                {/* 数据标签 */}
                                                <text
                                                    x={x}
                                                    y={y - 12}
                                                    fontSize="12"
                                                    fill="#52c41a"
                                                    textAnchor="middle"
                                                    fontWeight="bold"
                                                >
                                                    {item.tasks}
                                                </text>
                                                {/* X轴标签 */}
                                                <text
                                                    x={x}
                                                    y={185}
                                                    fontSize="12"
                                                    fill="#666"
                                                    textAnchor="middle"
                                                >
                                                    {item.date}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* 图表说明 */}
                            <div style={{
                                textAlign: 'center',
                                marginTop: 16,
                                color: '#666',
                                fontSize: 14
                            }}>
                                {trendPeriod === 'week' ? '每日任务创建数量' : '每日任务创建数量'}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default Statistics;