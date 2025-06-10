import React, { useState, useEffect } from 'react';
import { Card, Typography, Steps, Divider, Timeline, Tag, Row, Col, Alert, Badge, Space, Button } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    HomeOutlined,
    TrophyOutlined,
    TeamOutlined,
    HeartOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
    BulbOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const RulesPage = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(60); 

    useEffect(() => {
        
        if (timeLeft <= 0) return;

     
        const intervalId = setInterval(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        }, 1000);

       
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const selectionSteps = [
        {
            title: '确定选择方向',
            description: '选择先选书院或先选教练',
            status: 'finish',
            icon: <BulbOutlined />
        },
        {
            title: '进行选择',
            description: '根据选择方向完成书院或教练选择',
            status: 'process',
            icon: <HeartOutlined />
        },
        {
            title: '提交选择',
            description: '确认选择结果，提交后不可修改',
            status: 'wait',
            icon: <CheckCircleOutlined />
        },
        {
            title: '系统分配',
            description: '根据规则进行书院和教练分配',
            status: 'wait',
            icon: <ThunderboltOutlined />
        },
    ];

    // 四个书院信息
    const academies = [
        { name: '白院', color: '#f0f0f0', textColor: '#000', description: '纯净理想，追求卓越' },
        { name: '绿院', color: '#52c41a', textColor: '#fff', description: '生机活力，创新成长' },
        { name: '金院', color: '#faad14', textColor: '#fff', description: '辉煌荣耀，领导未来' },
        { name: '蓝院', color: '#1890ff', textColor: '#fff', description: '深邃智慧，探索真理' }
    ];    // 选择方向
    const selectionPaths = [
        {
            title: '先选书院',
            icon: <HomeOutlined />,
            color: '#1890ff',
            steps: [
                '查看白院、绿院、金院、蓝院详细介绍',
                '确定书院后，仅展示该书院内的教练',
                '拥有10张投票票数，可自由分配给所选书院的若干位老师',
                '系统以票数最多的老师为首选老师'
            ]
        },
        {
            title: '先选教练',
            icon: <UserOutlined />,
            color: '#52c41a',
            steps: [
                '浏览教练列表，了解专业领域和教学风格',
                '拥有10张投票票数，可自由分配给若干位老师',
                '票数既可集中投给一个老师，也能分散投给多个',
                '系统自动绑定教练所在书院'
            ]
        }
    ]; return (
        <div>
            <Title level={2}>规则 & 流程</Title>
            <Alert
                message="欢迎加入探月社区！"
                description="为帮助你快速融入集体，建立归属感，我们整合了书院与教练选择流程。以下是详细规则与操作流程，请仔细阅读。"
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
            />

            {/* 一、选择流程 */}
            <Card title="一、选择流程" style={{ marginBottom: 24 }}>
                <Steps
                    current={1}
                    items={selectionSteps}
                    style={{ marginBottom: 24 }}
                />

                <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
                    <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
                    确定选择方向
                </Title>
                <Paragraph>你可以从两个方向开启选择——先选书院或先选教练。</Paragraph>

                <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                    {selectionPaths.map((path, index) => (
                        <Col xs={24} md={12} key={index}>
                            <Card
                                size="small"
                                title={
                                    <Space>
                                        <Badge color={path.color} />
                                        {path.icon}
                                        <span>{path.title}</span>
                                    </Space>
                                }
                                style={{
                                    borderColor: path.color,
                                    borderWidth: 2
                                }}
                            >                                <Timeline
                                    size="small"
                                    items={path.steps.map((step) => ({
                                        children: <Text>{step}</Text>
                                    }))}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Divider />

                <Title level={4}>
                    <HomeOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    四大书院介绍
                </Title>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    {academies.map((academy, index) => (
                        <Col xs={12} sm={6} key={index}>
                            <Card
                                size="small"
                                style={{
                                    backgroundColor: academy.color,
                                    color: academy.textColor,
                                    textAlign: 'center',
                                    borderColor: academy.color
                                }}
                            >
                                <Title level={4} style={{ color: academy.textColor, margin: 0 }}>
                                    {academy.name}
                                </Title>
                                <Text style={{ color: academy.textColor, fontSize: 12 }}>
                                    {academy.description}
                                </Text>
                            </Card>
                        </Col>
                    ))}
                </Row>                <Alert
                    type="info"
                    message="投票规则详解"
                    description={
                        <div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>先选书院：</Text>每位学习者拥有 10 张投票票数，可自由分配给所选书院的若干位老师，票数既可以集中投给一个老师，也能分散投给多个。系统将把你票数最多的所选书院中的老师视为首选老师。
                            </div>
                            <div>
                                <Text strong>先选教练：</Text>每位学习者拥有 10 张投票票数，可自由分配给若干位老师，票数既可以集中投给一个老师，也能分散投给多个。
                            </div>
                        </div>
                    }
                    style={{ marginTop: 16 }}
                />

                <Divider />

                <Title level={4}>
                    <CheckCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    提交选择
                </Title>                <Alert
                    type="warning"
                    message="重要提醒"
                    description="完成书院和教练的选择后，点击【提交】按钮，确认你的选择。提交后，选择结果不可修改，请谨慎操作。"
                    showIcon
                />
            </Card>

            {/* 二、分配规则 */}
            <Card title="二、分配规则" style={{ marginBottom: 24 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Card
                            size="small"
                            title={
                                <Space>
                                    <HomeOutlined style={{ color: '#1890ff' }} />
                                    <span>书院分配</span>
                                </Space>
                            }
                            style={{ height: '100%' }}                        >
                            <div style={{ padding: 16, background: '#f0f5ff', borderRadius: 6, marginBottom: 16 }}>
                                <HomeOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                <Text strong>书院容量</Text>
                                <br />
                                <Text type="secondary">每个书院可以容纳一定数量的学习者</Text>
                            </div>

                            <div style={{ padding: 16, background: '#f6ffed', borderRadius: 6, marginBottom: 16 }}>
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <Text strong>优先选择书院</Text>
                                <br />
                                <Text type="secondary">学习者可以直接入选书院，再选择教练</Text>
                            </div>

                            <div style={{ padding: 16, background: '#fff2e8', borderRadius: 6 }}>
                                <UserOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                                <Text strong>优先选择教练</Text>
                                <br />
                                <Text type="secondary">学习者的书院会跟教练一致</Text>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card
                            size="small"
                            title={
                                <Space>
                                    <UserOutlined style={{ color: '#52c41a' }} />
                                    <span>教练分配</span>
                                </Space>
                            }
                            style={{ height: '100%' }}
                        >
                            <div style={{ padding: 16, background: '#f6ffed', borderRadius: 6, marginBottom: 16 }}>
                                <TeamOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <Text strong>指导名额限制</Text>
                                <br />
                                <Text type="secondary">每位教练可指导一定数量的学习者</Text>
                            </div>

                            <div style={{ padding: 16, background: '#fff2e8', borderRadius: 6, marginBottom: 16 }}>
                                <TrophyOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                                <Text strong>分配原则</Text>
                                <br />
                                <Text type="secondary">当选择人数超出名额时，按照分配的票数匹配</Text>
                            </div>

                            <div style={{ padding: 16, background: '#f0f5ff', borderRadius: 6 }}>
                                <SafetyOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                <Text strong>备选方案</Text>
                                <br />
                                <Text type="secondary">未分配到首选教练的学习者会进入自由池</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* 重要提醒 */}
            <Card title="重要提醒">
                <Timeline
                    items={[
                        {
                            dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                            children: (
                                <div>
                                    <Text strong>仔细了解书院特色</Text>
                                    <br />
                                    <Text type="secondary">
                                        充分了解各书院的理念和特色，做出最适合的选择
                                    </Text>
                                </div>
                            ),
                        },
                        {
                            dot: <UserOutlined style={{ color: '#1890ff' }} />,
                            children: (
                                <div>
                                    <Text strong>关注教练信息</Text>
                                    <br />
                                    <Text type="secondary">
                                        了解教练的专业领域和教学风格，选择最匹配的导师
                                    </Text>
                                </div>
                            ),
                        },
                        {
                            dot: <ClockCircleOutlined style={{ color: '#faad14' }} />,
                            children: (
                                <div>
                                    <Text strong>及时提交选择</Text>
                                    <br />
                                    <Text type="secondary">
                                        建议在规定时间内完成选择，避免错过最佳机会
                                    </Text>
                                </div>
                            ),
                        },
                        {
                            dot: <SafetyOutlined style={{ color: '#f5222d' }} />,
                            children: (
                                <div>
                                    <Text strong>谨慎确认提交</Text>
                                    <br />
                                    <Text type="secondary">
                                        提交后无法修改，请确认所有选择无误后再提交
                                    </Text>
                                </div>
                            ),
                        },
                    ]}
                />
            </Card>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => navigate('/selection')}
                    disabled={timeLeft > 0}
                >
                    {timeLeft > 0 ? `请仔细阅读 (${timeLeft}s)` : '我已阅读并理解规则，下一步'}
                </Button>
            </div>
        </div>
    );
};

export default RulesPage;
