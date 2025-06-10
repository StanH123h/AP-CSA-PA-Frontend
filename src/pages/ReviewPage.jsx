import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Spin, Alert, InputNumber, message, Tag, Avatar, Popconfirm, Result, Empty } from 'antd';
import { UserOutlined, BankOutlined, CheckCircleOutlined, InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { getAllTeachers, submitStudentChoices, getCurrentActiveSession } from '../api';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const MAX_VOTES = 10;
const MAX_TEACHERS = 3;
const ACADEMY_TO_BADGE_COLOR_MAPPING = {
    "蓝院": "blue",
    "金院": "gold",
    "白院": "rgb(180,178,178)",
    "绿院": "green"
}

const ReviewPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null);
    const [selectedTeachers, setSelectedTeachers] = useState(new Map());
    const [submitting, setSubmitting] =useState(false);

    const studentId = localStorage.getItem('studentId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const sessionResponse = await getCurrentActiveSession();
                if (sessionResponse.data.code !== 200 || !sessionResponse.data.data) {
                    setError('当前没有正在进行的选拔会话。');
                    setSession(null);
                    return;
                }
                setSession(sessionResponse.data.data);

                const teachersResponse = await getAllTeachers();
                if (teachersResponse.data.code === 200) {
                    const resData = teachersResponse.data;
                    const selectedCoaches = JSON.parse(localStorage.getItem("selected_coach_ids")) || [];

                    const sortedTeachers = resData.data.sort((a, b) => {
                        const aSelected = selectedCoaches.includes(a.id);
                        const bSelected = selectedCoaches.includes(b.id);
                        if (aSelected === bSelected) return 0;
                        return aSelected ? -1 : 1;
                    });

                    setTeachers(sortedTeachers);
                } else {
                    setError(teachersResponse.data.msg || '无法加载教师列表。');
                }
            } catch (err) {
                setError('加载数据时出错，请刷新页面重试');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        if (!studentId) {
            navigate('/login');
            message.error('请先登录！');
            return;
        }

        fetchData();
    }, [studentId, navigate]);

    const handleVoteChange = (teacherId, votes) => {
        const newSelected = new Map(selectedTeachers);
        const currentVotes = votes || 0;

        if (currentVotes > 0) {
            newSelected.set(teacherId, currentVotes);
        } else {
            newSelected.delete(teacherId);
        }

        // Enforce max 3 teachers
        if (newSelected.size > MAX_TEACHERS) {
            message.warning(`最多只能选择 ${MAX_TEACHERS} 位教师。`);
            return;
        }

        // Enforce max 10 votes
        const totalVotes = Array.from(newSelected.values()).reduce((acc, v) => acc + v, 0);
        if (totalVotes > MAX_VOTES) {
            message.warning(`总票数不能超过 ${MAX_VOTES} 票。`);
            return;
        }

        setSelectedTeachers(newSelected);
    };

    const handleSubmit = async () => {
        const totalVotes = Array.from(selectedTeachers.values()).reduce((acc, v) => acc + v, 0);

        if (totalVotes !== MAX_VOTES) {
            message.error(`总票数必须等于 ${MAX_VOTES} 票，当前为 ${totalVotes} 票。`);
            return;
        }

        if (selectedTeachers.size === 0) {
            message.error('请至少选择一位教师。');
            return;
        }

        const choiceData = {
            studentId: parseInt(studentId),
            teacherVotes: Array.from(selectedTeachers.entries()).map(([teacherId, votes]) => ({
                teacherId,
                votes
            }))
        };

        setSubmitting(true);
        try {
            const response = await submitStudentChoices(choiceData);
            if (response.data.code === 200) {
                message.success('选择提交成功！');
                navigate('/my-choices');
            } else {
                message.error(response.data.msg || '提交失败，请重试。');
            }
        } catch (err) {
            message.error(err.response?.data?.msg || '提交时发生错误。');
        } finally {
            setSubmitting(false);
        }
    };

    const totalVotesUsed = Array.from(selectedTeachers.values()).reduce((acc, v) => acc + v, 0);
    const votesRemaining = MAX_VOTES - totalVotesUsed;

    const renderTeacherCard = (teacher) => (
        <Col xs={24} sm={12} lg={8} key={teacher.id}>
            <Card
                hoverable
                style={{
                    border: selectedTeachers.has(teacher.id) ? '2px solid #1890ff' : '',
                    position: 'relative',
                    background: (JSON.parse(localStorage.getItem("selected_coach_ids")) || []).includes(teacher.id)
                        ? 'rgba(144, 238, 144, 0.3)' // lightgreen with transparency
                        : 'rgba(211, 211, 211, 0.3)' // lightgray with transparency
                }}
                actions={[
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Text strong>你的票数: </Text>
                        <InputNumber
                            min={0}
                            max={MAX_VOTES}
                            value={selectedTeachers.get(teacher.id) || 0}
                            onChange={(value) => handleVoteChange(teacher.id, value)}
                            style={{ marginLeft: 8, width: '80px' }}
                        />
                    </div>
                ]}
            >
                <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: (JSON.parse(localStorage.getItem("selected_coach_ids")) || []).includes(teacher.id) ? '#52c41a' : '#aaa',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                }}>
                    {(JSON.parse(localStorage.getItem("selected_coach_ids")) || []).includes(teacher.id) ? '上一阶段已选' : '上一阶段未选'}
                </div>

                {(JSON.parse(localStorage.getItem("selected_coach_ids")) || []).includes(teacher.id) &&
                    <CheckCircleOutlined style={{
                        position: 'absolute',
                        top: 40,
                        right: 16,
                        color: '#1890ff',
                        fontSize: '24px'
                    }}/>
                }

                <Card.Meta
                    avatar={<Avatar size={64} src={teacher.image} icon={<UserOutlined />} />}
                    title={teacher.name}
                    description={
                        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ marginTop: 4 }}>
                            {teacher.description}
                        </Paragraph>
                    }
                />
                <div style={{ marginTop: 12, height: '60px' }}>
                    <Tag icon={<BankOutlined />} color={ACADEMY_TO_BADGE_COLOR_MAPPING[teacher.houseName]}>{teacher.houseName}</Tag>
                    <Tag icon={<InfoCircleOutlined />} color="geekblue">{teacher.mbti}</Tag>
                    <Tag icon={<TeamOutlined />} color="green">Capacity: {teacher.capacity}</Tag>
                </div>
            </Card>
        </Col>
    );

    if (loading) {
        return <Spin size="large" tip="加载教师列表中..." fullscreen />;
    }

    if (error || !session) {
        return <Result status="info" title={error || "当前无选拔会话"} subTitle="请等待管理员开启，或联系管理员获取更多信息。" />;
    }

    return (
        <div>
            <Title level={2}>选择教练</Title>
            <Paragraph>
                你有 <Text strong>{MAX_VOTES}</Text> 张票，最多可以投给 <Text strong>{MAX_TEACHERS}</Text> 位你心仪的教练。
                你的最终书院将根据你选择的教练决定。
            </Paragraph>

            <Card style={{ position: 'sticky', top: 80, zIndex: 10, marginBottom: 24 }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            我的投票面板
                        </Title>
                    </Col>
                    <Col>
                        <Text strong>剩余票数: </Text>
                        <Tag color={votesRemaining > 0 ? "blue" : "green"} style={{ fontSize: '18px', padding: '5px 10px' }}>{votesRemaining}</Tag>
                        <Text strong style={{ marginLeft: 16 }}>已选教练: </Text>
                        <Tag color={selectedTeachers.size > 0 ? "blue" : "default"} style={{ fontSize: '18px', padding: '5px 10px' }}>{selectedTeachers.size} / {MAX_TEACHERS}</Tag>
                    </Col>
                    <Col>
                        <Popconfirm
                            title="确认提交您的选择吗？"
                            description="提交后将无法修改，请谨慎操作。"
                            onConfirm={handleSubmit}
                            okText="确认提交"
                            cancelText="再想想"
                            disabled={submitting || votesRemaining !== 0}
                        >
                            <Button
                                type="primary"
                                size="large"
                                loading={submitting}
                                disabled={votesRemaining !== 0}
                            >
                                提交我的选择
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
                {votesRemaining !== 0 &&
                    <Alert message={`请确保您的总票数正好为 ${MAX_VOTES} 票。`} type="info" showIcon style={{marginTop: 16}}/>
                }
            </Card>

            <Row gutter={[24, 24]}>
                {teachers.length > 0 ? teachers.map(renderTeacherCard) : <Empty description="当前无教师信息" />}
            </Row>
        </div>
    );
};

export default ReviewPage;
