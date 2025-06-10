import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../api.js';

const { Title } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        setLoading(true);
        setError('');
        try {
            const response = await login(values.username, values.password);
            if (response.data.code === 200) {
                // Store student info if needed, e.g., in localStorage
                localStorage.setItem('studentId', response.data.data);
                console.log('Student login successful, studentId:', response.data.data);
                navigate('/dashboard');
            } else {
                setError(response.data.msg || '登录失败，请检查您的用户名和密码。');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.msg || err.message || '登录时发生未知错误。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card style={{
                width: 400,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '16px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#333' }}>👋 欢迎登录</Title>
                    <Typography.Text type="secondary">学生登录入口</Typography.Text>
                </div>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                            placeholder="请输入您的用户名"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                            placeholder="请输入您的密码"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox style={{ color: '#555' }}>记住我</Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot" href="" style={{ float: 'right', color: '#1890ff' }}>
                            忘记密码?
                        </a>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '16px' }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} size="large" loading={loading}>
                            登 录
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
