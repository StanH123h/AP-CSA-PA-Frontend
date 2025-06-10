import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Tag, Avatar, Button, Modal, Timeline, Progress, Spin, Alert, Empty, Tooltip } from 'antd';
import { HeartOutlined, UserOutlined, BookOutlined, EditOutlined, CheckCircleOutlined, LockOutlined, BankOutlined } from '@ant-design/icons';
import { getStudentChoices, getCurrentActiveSession } from '../api.js';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const MyChoicesPage = () => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [choices, setChoices] = useState([]);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const studentId = localStorage.getItem('studentId');
    const navigate = useNavigate();

    useEffect(() => {
        if (!studentId) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [choicesResponse, sessionResponse] = await Promise.all([
                    getStudentChoices(studentId),
                    getCurrentActiveSession()
                ]);
                console.log(choicesResponse);
                if (choicesResponse.data.code === 200) {
                    setChoices(choicesResponse.data.data || []);
                } else {
                    console.error('Failed to fetch choices:', choicesResponse.data.msg);
                }

                if (sessionResponse.data.code === 200) {
                    setSession(sessionResponse.data.data);
                } else {
                    console.error('Failed to fetch session:', sessionResponse.data.msg);
                }

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId, navigate]);

    const teacherChoices = (choices || []).map(choice => ({
        ...choice.teacherInfo,
        votes: choice.votes
    }));

    const choicesByHouse = teacherChoices.reduce((acc, teacher) => {
        const houseName = teacher.houseName || '未知书院';
        if (!acc[houseName]) {
            acc[houseName] = [];
        }
        acc[houseName].push(teacher);
        acc[houseName].sort((a, b) => b.votes - a.votes);
        return acc;
    }, {});

    const totalVotes = teacherChoices.reduce((acc, teacher) => acc + teacher.votes, 0);
    const submissionTime = choices.length > 0 && choices[0].session ? dayjs(choices[0].session.updatedAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A';
    const isSelectionLocked = !session || session.status !== 'ACTIVE';

    const getScoreColor = (score) => {
        if (score >= 90) return '#52c41a';
        if (score >= 80) return '#1890ff';
        if (score >= 70) return '#faad14';
        return '#f5222d';
    };

    const getScoreStatus = (score) => {
        if (score >= 90) return 'success';
        if (score >= 80) return 'active';
        if (score >= 70) return 'normal';
        return 'exception';
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message={`错误: ${error.message}`} type="error" showIcon/>;
    }

    if (choices.length === 0) {
        return (
            <div style={{ padding: '50px 0' }}>
                <Empty description={
                    <>
                        <Title level={4}>你还没有做出选择</Title>
                        <Text>当前选择窗口{isSelectionLocked ? '已关闭' : '正在开放'}，立即前往选择页面吧！</Text>
                    </>
                }>
                    <Button type="primary" size="large" onClick={() => navigate('/selection')} disabled={isSelectionLocked}>
                        前往选择页面
                    </Button>
                </Empty>
            </div>
        )
    }

    return (
        <div>
            <Title level={2}><HeartOutlined /> 我的选择</Title>
            <Paragraph>
                这里是你对教练的选择和投票情况。请确保你的选择符合规则，并且总票数为10票。
            </Paragraph>

            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                            <div style={{ marginTop: 8 }}>
                                <Text strong>选择状态</Text><br />
                                <Tag color="green">已提交</Tag>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">提交时间</Text><br />
                            <Text strong>{submissionTime}</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">已选教练</Text><br />
                            <Text strong>{teacherChoices.length} / 3</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">已用票数</Text><br />
                            <Text strong>{totalVotes} / 10</Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card
                title={<span><UserOutlined style={{ marginRight: 8 }} />我选择的教练</span>}
                // extra={
                //     <Tooltip title={isSelectionLocked ? `选择已于 ${session ? dayjs(session.endTime).format('YYYY-MM-DD HH:mm') : ''} 关闭` : "前往选择页面修改你的投票"}>
                //         <Button
                //             type="primary"
                //             icon={isSelectionLocked ? <LockOutlined /> : <EditOutlined />}
                //             onClick={() => navigate('/selection')}
                //             disabled={isSelectionLocked}
                //         >
                //             修改选择
                //         </Button>
                //     </Tooltip>
                // }
            >
                {Object.entries(choicesByHouse).map(([houseName, teachers]) => (
                    <Card type="inner" title={<><BankOutlined /> {houseName}</>} key={houseName} style={{ marginBottom: 16 }}>
                         <Row gutter={[16, 16]}>
                            {teachers.map(teacher => (
                                <Col xs={24} lg={12} key={teacher.id}>
                                    <Card size="small" >
                                        <Card.Meta
                                            avatar={<Avatar src={teacher.image} icon={<UserOutlined />} />}
                                            title={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>{teacher.name}</span>
                                                    <Tag color="blue" style={{fontSize: '14px'}}>{teacher.votes} 票</Tag>
                                                </div>
                                            }
                                            description={teacher.description}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                ))}
            </Card>
        </div>
    );
};

export default MyChoicesPage;
