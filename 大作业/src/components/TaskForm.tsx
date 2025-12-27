import React from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { Task, TaskStatus } from '../types';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface TaskFormProps {
    visible: boolean;
    task?: Task;
    onCancel: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, task, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (visible && task) {
            form.setFieldsValue({
                title: task.title,
                description: task.description,
                timeRange: [dayjs(task.startTime), dayjs(task.endTime)],
                status: task.status
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, task, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const [startTime, endTime] = values.timeRange;

            if (endTime.isBefore(startTime)) {
                message.error('结束时间不能早于开始时间');
                return;
            }

            onSubmit({
                title: values.title,
                description: values.description || '',
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: values.status || TaskStatus.PENDING
            });

            form.resetFields();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    return (
        <Modal
            title={task ? '编辑任务' : '创建新任务'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="确定"
            cancelText="取消"
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: TaskStatus.PENDING
                }}
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
                    <TextArea rows={3} placeholder="请输入任务描述（可选）" />
                </Form.Item>

                <Form.Item
                    name="timeRange"
                    label="时间范围"
                    rules={[{ required: true, message: '请选择开始和结束时间' }]}
                >
                    <RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开始时间', '结束时间']}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {task && (
                    <Form.Item
                        name="status"
                        label="状态"
                    >
                        <Input disabled value={task.status === TaskStatus.COMPLETED ? '已完成' : '待完成'} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default TaskForm;