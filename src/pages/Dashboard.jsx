import React, { useState, useEffect } from 'react';
import {
    SmileOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import {
    Typography,
    Alert,
    Card,
    Col,
    Row,
    Badge,
    Button,
    Space,
    List,
    Avatar,
    Timeline,
    Tag,
    Spin,
    Empty,
    Descriptions,
} from 'antd';
import { getCurrentActiveSession } from '../api.js';
import dayjs from 'dayjs';


// 仪表盘组件
const Dashboard = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 获取当前时间
    const currentTime = new Date();
    const hours = currentTime.getHours();

    useEffect(() => {
        const fetchCurrentSession = async () => {
            try {
                setLoading(true);
                setError(null); // Reset error state on new fetch
                const response = await getCurrentActiveSession();

                // Check for the specific message indicating no active session
                if (response.data && response.data.msg === '当前无活跃会话') {
                    setSession(null);
                } else if (response.data.code === 200 && response.data.data) {
                    // Successful response with session data
                    setSession(response.data.data);
                } else {
                    // Handle other cases that might be considered errors
                    setError(new Error(response.data.msg || '无法获取会话'));
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentSession();
    }, []);


    let greeting;
    if (hours < 6) {
        greeting = "夜猫子，还不休息？🦉";
    } else if (hours < 12) {
        greeting = "早上好，今天也要元气满满哦！🌞";
    } else if (hours < 14) {
        greeting = "午饭吃了吗？不要忘记午休哦！🍱";
    } else if (hours < 18) {
        greeting = "下午茶时间到！伸伸懒腰吧☕";
    } else if (hours < 22) {
        greeting = "晚上好，今天的工作辛苦了！🌙";
    } else {
        greeting = "深夜工作，注意休息哦！🌠";
    }

    const renderSessionStatus = (status) => {
        let color = 'default';
        switch (status) {
            case 'ACTIVE':
                color = 'green';
                break;
            case 'CLOSED':
                color = 'red';
                break;
            case 'PENDING':
                color = 'gold';
                break;
            case 'COMPLETED':
                color = 'blue';
                break;
            default:
                color = 'grey';
        }
        return <Tag color={color}>{status}</Tag>;
    };

    return (
        <div>
            {/* 欢迎区域 */}
            <div style={{ marginBottom: 24 }}>
                <Typography.Title level={2} style={{ marginBottom: 50 }}>
                    <span role="img" aria-label="wave" style={{ marginRight: 8 }}>👋</span>
                    你好同学
                </Typography.Title>

                <Alert
                    message={<Typography.Text strong>{greeting}</Typography.Text>}
                    type="success"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
            </div>

            {/* Current Active Session */}
            <Card
                title={
                    <Space>
                        <ClockCircleOutlined />
                        <span>当前选拔会话</span>
                    </Space>
                }
                style={{ marginBottom: 24 }}
            >
                {loading && <div style={{ textAlign: 'center', padding: '50px 0' }}><Spin size="large" /></div>}
                {error && <Alert message={`错误: ${error.message}`} type="error" showIcon />}
                {!loading && !error && (
                    session ? (
                        <>
                            <Descriptions bordered column={1} size="middle">
                                <Descriptions.Item label="会话标题">{session.title}</Descriptions.Item>
                                <Descriptions.Item label="状态">{renderSessionStatus(session.status)}</Descriptions.Item>
                                <Descriptions.Item label="开始时间">{dayjs(session.startTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                                <Descriptions.Item label="结束时间">{dayjs(session.endTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                                <Descriptions.Item label="说明">{session.description}</Descriptions.Item>
                            </Descriptions>
                            <div style={{ marginTop: 24, textAlign: 'right' }}>
                                <Button type="primary" onClick={() => navigate('/rules')}>
                                    下一步：查看规则&流程
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Empty description="当前无活跃会话" />
                    )
                )}
            </Card>

            <Alert
                message="提示"
                description={`请在"选择教练&书院"页面中进行你的选择，并在"我的选择"页面中查看你的提交。祝你好运！`}
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
            />

        </div>
    );
};

export default Dashboard;
