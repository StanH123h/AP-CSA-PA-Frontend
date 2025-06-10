import React, {useEffect, useState} from 'react';
import "./ResultsPage.scss"
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    FloatButton,
    Input, notification,
    Popover,
    Rate,
    Result,
    Row,
    Spin,
    Tag,
    Typography
} from 'antd';
import {BookOutlined, CheckCircleOutlined, GiftOutlined, TrophyOutlined, UserOutlined} from '@ant-design/icons';
import Confetti from 'react-confetti';
import {getStudentMatchResult} from "../api.js";

const {Title, Paragraph, Text} = Typography;
const CUSTOM_RATE_ICONS = {
    1: "M",
    2: "O",
    3: "O",
    4: "N",
    5: "S",
    6: "H",
    7: "O",
    8: "T"
}
const SHOW_SURVEY = JSON.parse(localStorage.getItem("show_survey"))??true
const ResultsPage = () => {
    const [showSurvey,setShowSurvey] = useState(SHOW_SURVEY)
    const [matchResult, setMatchResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const studentId = localStorage.getItem('studentId');
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api.open({
            message: '感谢提交🎉',
            description:
                '我们讲积极根据您的建议迭代产品',
            duration: 2,
            placement:"bottomRight"
        });
    };
    const [popoverOpen, setPopoverOpen] = useState(true)
    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const response = await getStudentMatchResult(studentId);
                if (response.data.code === 200) {
                    const resultData = response.data.data;
                    setMatchResult(resultData);
                    if (resultData) {
                        setShowConfetti(true);

                        setTimeout(() => setShowConfetti(false), 10000);
                    }
                } else {
                    setError(new Error(response.data.msg || 'Failed to fetch match result'));
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [studentId]);


    if (loading) {
        return <div style={{textAlign: 'center', padding: '100px 0'}}><Spin size="large"/></div>;
    }

    if (error) {
        return <Alert message={`错误: ${error.message}`} type="error" showIcon/>;
    }

    if (!matchResult) {
        return (
            <Result
                icon={<TrophyOutlined/>}
                title="暂无匹配结果"
                subTitle="系统可能仍在处理中，或管理员尚未公布结果。请稍后再试。"
            />
        );
    }


    const {name, description, houseName, mbti, image} = matchResult;

    return (
        <div className={"results-page"}>
            {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)}/>}
            <Title level={2}><TrophyOutlined/> 查看结果</Title>
            <Paragraph>
                恭喜！系统已为你完成智能匹配。以下是你的最终匹配结果。
            </Paragraph>

            <Result
                status="success"
                title="匹配成功！"
                subTitle="你已成功匹配到一位优秀的导师和书院。"
            />

            {/* 最终匹配的教练 */}
            <Card
                title={
                    <span>
                        <UserOutlined style={{marginRight: 8}}/>
                        你的导师
                    </span>
                }
                style={{marginBottom: 24}}
            >
                <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} md={8} style={{textAlign: 'center'}}>
                        <Avatar size={128} src={image} icon={<UserOutlined/>}/>
                        <Title level={4} style={{marginTop: 16}}>{name}</Title>
                        <Text type="secondary">{houseName}</Text>
                    </Col>
                    <Col xs={24} md={16}>
                        <div style={{padding: 16, background: '#f9f9f9', borderRadius: 8}}>
                            <GiftOutlined style={{color: '#1890ff', marginRight: 8}}/>
                            <Text strong>导师简介</Text>
                            <Paragraph style={{marginTop: 8}}>
                                {description}
                            </Paragraph>
                        </div>
                        <div style={{marginTop: 16}}>
                            <Tag color="blue">{mbti}</Tag>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* 最终匹配的书院 */}
            <Card
                title={
                    <span>
                        <BookOutlined style={{marginRight: 8}}/>
                        你的书院
                    </span>
                }
            >
                <Row align="middle">
                    <Col span={24}>
                        <Result
                            icon={<CheckCircleOutlined/>}
                            title={houseName}
                            subTitle="你的书院将与你的导师保持一致。"
                        />
                    </Col>
                </Row>
            </Card>
            {
                showSurvey
                    ?
                    <Popover
                        content={
                            <div className={"pop-over"}
                                 style={{display: "flex", flexDirection: "column", width: "200px", height: "auto", justifyContent:"center", gap:"20px"}}>
                                <div>
                                    <Text type="secondary" style={{fontSize: "10px"}}>每个字母代表1分</Text>
                                    <Rate character={({index = 0}) => CUSTOM_RATE_ICONS[index + 1]} allowHalf count={8}/>
                                </div>
                                <Input placeholder="反馈补充"/>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    openNotification();
                                    setShowSurvey(false)
                                  }}
                                >
                                  提交
                                </Button>
                            </div>
                        }
                        title="对此次服务进行评价?"
                        trigger="click"
                        placement={"topLeft"}
                        open={popoverOpen}
                        onOpenChange={(newOpen) => {
                            setPopoverOpen(newOpen)
                        }}
                    >
                        <FloatButton style={{insetInlineEnd: 60}}
                        />
                    </Popover>
                :
                <></>
            }
            {contextHolder}
        </div>
    );
};

export default ResultsPage;
