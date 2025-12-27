import React, { useState, useEffect } from 'react';
import { Card, Form, Button, message, Input, ColorPicker } from 'antd';
import { AppSettings } from '../types';
import { SettingsStorage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
    const [form] = Form.useForm();
    const [settings, setSettings] = useState<AppSettings>();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        primaryColor: '#7ce5ef',
        activeColor: '#f4bff4',
        borderRadius: 20
    });
    const { updateTheme } = useTheme();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        const currentSettings = SettingsStorage.getSettings();
        setSettings(currentSettings);
        const values = {
            primaryColor: currentSettings.theme.primaryColor,
            activeColor: currentSettings.theme.activeColor,
            borderRadius: currentSettings.theme.borderRadius
        };
        form.setFieldsValue(values);
        setFormValues(values);
    };

    const handleSaveSettings = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const newSettings: AppSettings = {
                ...settings!,
                theme: {
                    primaryColor: values.primaryColor,
                    activeColor: values.activeColor,
                    borderRadius: values.borderRadius
                }
            };

            SettingsStorage.saveSettings(newSettings);
            setSettings(newSettings);

            // 更新主题上下文
            updateTheme(values.primaryColor, values.activeColor, values.borderRadius);

            message.success('设置保存成功！');
        } catch (error) {
            message.error('保存设置失败');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSettings = () => {
        const defaultSettings: AppSettings = {
            theme: {
                primaryColor: '#7ce5ef',
                activeColor: '#f4bff4',
                borderRadius: 20
            },
            language: 'zh-CN'
        };

        SettingsStorage.saveSettings(defaultSettings);
        setSettings(defaultSettings);
        const values = {
            primaryColor: defaultSettings.theme.primaryColor,
            activeColor: defaultSettings.theme.activeColor,
            borderRadius: defaultSettings.theme.borderRadius
        };
        form.setFieldsValue(values);
        setFormValues(values);

        // 更新主题上下文
        updateTheme(defaultSettings.theme.primaryColor, defaultSettings.theme.activeColor, defaultSettings.theme.borderRadius);

        message.success('设置已重置为默认值');
    };

    if (!settings) {
        return <div>加载中...</div>;
    }

    return (
        <div>
            <div style={{
                marginBottom: 24,
                fontSize: 16,
                color: '#333',
                fontWeight: 'normal'
            }}>
                个性化你的页面主题设置
            </div>
            <Card style={{ marginBottom: 24 }}>
                <Form
                    form={form}
                    layout="vertical"
                    size="large"
                    validateTrigger="onSubmit"
                >
                    {/* 主题色配置 */}
                    <Form.Item
                        name="primaryColor"
                        label={
                            <span style={{ fontSize: 18, fontWeight: 600 }}>
                                主题色 <span style={{ color: '#ff4d4f' }}>*</span>
                            </span>
                        }
                        rules={[{ required: true, message: '请选择主题色' }]}
                        style={{ marginBottom: 32 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <ColorPicker
                                showText={false}
                                format="hex"
                                size="large"
                                style={{ width: 60, height: 40 }}
                                value={formValues.primaryColor}
                                onChange={(color) => {
                                    const hexColor = color.toHexString();
                                    form.setFieldValue('primaryColor', hexColor);
                                    setFormValues(prev => ({ ...prev, primaryColor: hexColor }));
                                }}
                            />
                            <div
                                style={{
                                    flex: 1,
                                    height: 40,
                                    borderRadius: 6,
                                    backgroundColor: formValues.primaryColor,
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'monospace',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: '#fff',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}
                            >
                                {formValues.primaryColor.toUpperCase()}
                            </div>
                        </div>
                    </Form.Item>

                    {/* 激活状态主题色配置 */}
                    <Form.Item
                        name="activeColor"
                        label={
                            <span style={{ fontSize: 18, fontWeight: 600 }}>
                                主题色(激活状态) <span style={{ color: '#ff4d4f' }}>*</span>
                            </span>
                        }
                        rules={[{ required: true, message: '请选择激活状态主题色' }]}
                        style={{ marginBottom: 32 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <ColorPicker
                                showText={false}
                                format="hex"
                                size="large"
                                style={{ width: 60, height: 40 }}
                                value={formValues.activeColor}
                                onChange={(color) => {
                                    const hexColor = color.toHexString();
                                    form.setFieldValue('activeColor', hexColor);
                                    setFormValues(prev => ({ ...prev, activeColor: hexColor }));
                                }}
                            />
                            <div
                                style={{
                                    flex: 1,
                                    height: 40,
                                    borderRadius: 6,
                                    backgroundColor: formValues.activeColor,
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'monospace',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: '#fff',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}
                            >
                                {formValues.activeColor.toUpperCase()}
                            </div>
                        </div>
                    </Form.Item>

                    {/* 圆角配置 */}
                    <Form.Item
                        name="borderRadius"
                        label={
                            <span style={{ fontSize: 18, fontWeight: 600 }}>
                                圆角 <span style={{ color: '#ff4d4f' }}>*</span>
                            </span>
                        }
                        rules={[
                            { required: true, message: '请输入圆角大小' }
                        ]}
                        style={{ marginBottom: 40 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Input
                                type="number"
                                style={{ width: 60, height: 40 }}
                                size="large"
                                placeholder="20"
                            />
                            <div
                                style={{
                                    flex: 1,
                                    height: 40,
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: '#666'
                                }}
                            >
                                {formValues.borderRadius}px
                            </div>
                        </div>
                    </Form.Item>
                </Form>

                {/* 操作按钮区域 */}
                <div style={{
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleSaveSettings}
                        style={{ width: 300 }}
                    >
                        确认修改
                    </Button>
                    <Button
                        size="large"
                        onClick={handleResetSettings}
                        style={{ width: 300 }}
                    >
                        重置为默认
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;