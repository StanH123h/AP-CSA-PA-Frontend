import {useRef, useState, useContext} from 'react';
import {App, Badge, Button, Card, Layout, Tour, Typography, message, Tag, Image} from 'antd';
import './SelectionPage.scss'
import {Carousel, CarouselContext} from "react-responsive-3d-carousel";
import 'react-responsive-3d-carousel/dist/styles.css'
import apiClient from "../api.js";
import {useNavigate} from "react-router-dom";
import NavBackButton from "../components/navBackButton/navBackButton.jsx";

const ACADEMY_TO_BADGE_COLOR_MAPPING = {
    "蓝院": "blue",
    "金院": "gold",
    "白院": "rgb(180,178,178)",
    "绿院": "green"
}
const ACADEMY_TO_BACKGROUND_COLOR_MAPPING = {
    "蓝院": "rgba(0, 0, 245,0.6)",
    "金院": "rgba(249, 216, 73,0.6)",
    "白院": "rgba(180,178,178,0.6)",
    "绿院": "rgba(55, 126, 34,0.6)"
}
const CarouselItemCard = ({
    coach,
    index,
    coachId,
    currentIndex,
    selectedCoachIndex,
    setSelectedCoachIndex,
    unselectedCoachIndex,
    setUnselectedCoachIndex,
    coachCardRef,
    buttonGroupRef,
}) => {
    const { slideNext } = useContext(CarouselContext)
    const {Meta} = Card;

    return (
        <div
            key={index}
            className={currentIndex === index ? "carousel-slide-active" : ""}
            style={{position: 'relative', marginBottom: '24px'}}
        >
            <Card
                ref={currentIndex === index ? coachCardRef : null}
                className={`coach-info-card ${
                    selectedCoachIndex.includes(coachId)
                        ? 'selected'
                        : unselectedCoachIndex.includes(coachId)
                            ? 'un-selected'
                            : ''
                }`}
                cover={<Image fallback={"/exampleTeacherImg.jpg"} src={`${coach.image}`} alt="coachImage" className={"img-coach"}/>}
            >
                <Badge.Ribbon text={coach.houseName} color={ACADEMY_TO_BADGE_COLOR_MAPPING[coach.houseName]}>
                    <Meta title={<div className={"name-and-mbti"}>{coach.name} <Tag className={"tag"} color={"orange"}>{coach.mbti}</Tag></div>} description={coach.description}/>

                </Badge.Ribbon>
            </Card>

            {currentIndex === index && (
                <div
                    ref={buttonGroupRef}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        paddingTop: '8px'
                    }}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon="✅"
                        onClick={(e) => {
                            setSelectedCoachIndex(prev => [...prev.filter(i => i !== coachId), coachId]);
                            setUnselectedCoachIndex(prev => prev.filter(i => i !== coachId));
                            e.stopPropagation()
                            slideNext();
                        }}
                    />

                    <Button
                        type="default"
                        shape="circle"
                        icon="❌"
                        onClick={(e) => {
                            setUnselectedCoachIndex(prev => [...prev.filter(i => i !== coachId), coachId]);
                            setSelectedCoachIndex(prev => prev.filter(i => i !== coachId));
                            e.stopPropagation()
                            slideNext();
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default function SelectionPage() {
    // 控制是否进入“基于教练选择书院”流程
    const [option, setOption] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCoachId, setSelectedCoachId] = useState([]);
    const [unselectedCoachId, setUnselectedCoachId] = useState([])
    const [data, setData] = useState([])
    const {Title, Text} = Typography
    const navigate = useNavigate()
    const goToNextStep = () => {
        if (selectedCoachId.length + unselectedCoachId.length < data.length) {
            message.warning('请对所有教练进行喜欢或不喜欢的分类');
            return;
        }
        console.log(selectedCoachId)
        navigate("/review")
        localStorage.setItem("selected_coach_ids",JSON.stringify(selectedCoachId))

        // Add navigation logic here
    };
    const coachCardRef = useRef(null);
    const buttonGroupRef = useRef(null);
    const nextStepButtonRef = useRef(null);

    // Tour 状态和步骤
    const [openTour, setOpenTour] = useState(false);
    const steps = [
        {
            title: '教练信息卡片',
            description: '这是教练的信息。',
            target: () => coachCardRef.current,
        },
        {
            title: '分类按钮',
            description: '请对每一位教练进行分类（喜欢✅或不喜欢❌）',
            target: () => buttonGroupRef.current,
        },
        {
            title: '完成分类',
            description: '完成全部分类后点击此按钮',
            target: () => nextStepButtonRef.current,
        },
    ];

    const items = data.map((coach, index) => (
        <CarouselItemCard
            key={index}
            coach={coach}
            coachId={coach.id}
            index={index}
            currentIndex={currentIndex}
            selectedCoachIndex={selectedCoachId}
            setSelectedCoachIndex={setSelectedCoachId}
            unselectedCoachIndex={unselectedCoachId}
            setUnselectedCoachIndex={setUnselectedCoachId}
            coachCardRef={coachCardRef}
            buttonGroupRef={buttonGroupRef}
        />
    ));

    return (
        <App>
                    <Layout.Content className={"selection-page"}>
                            <>
                                {option===null ? (
                                    <>
                                        <Title level={2}>选择教练&书院</Title>

                                        <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                                            <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                                                <Card
                                                    hoverable
                                                    style={{width: 300}}
                                                    onClick={() => {
                                                        apiClient.get('/teachers').then(res=>{
                                                            const resData = res.data
                                                            setData(resData.data)
                                                            setOption("chooseByCoach")
                                                        }).catch(err=>console.log(err))
                                                    }}
                                                    cover={<div style={{
                                                        fontSize: '48px',
                                                        textAlign: 'center',
                                                        padding: '24px'
                                                    }}>🎓</div>}
                                                >
                                                    <Card.Meta
                                                        title="基于教练选择书院"
                                                        description="从教练入手，优先选出您喜欢的教练，系统将自动为您匹配最适合的书院。"
                                                    />
                                                </Card>
                                                <Card
                                                    hoverable
                                                    style={{width: 300}}
                                                    cover={<div style={{
                                                        fontSize: '48px',
                                                        textAlign: 'center',
                                                        padding: '24px'
                                                    }}>🏫</div>}
                                                    onClick={() => setOption("chooseByAcademy")}
                                                >
                                                    <Card.Meta
                                                        title="基于书院选择教练"
                                                        description="从书院出发，系统将列出所属教练供您选择。"
                                                    />
                                                </Card>
                                            </div>
                                        </div>
                                    </>

                                ):<></>}
                                {option === "chooseByCoach" ? (
                                    <>
                                        <Title>基于教练选择书院</Title>
                                        <Text>选择您喜欢的教练，我们将为您自动匹配对应的书院</Text>
                                        <Button className={"tour"} type="primary" onClick={() => setOpenTour(true)}
                                                style={{marginBottom: 16}}>
                                            快速上手
                                        </Button>
                                        <Carousel
                                            items={items}
                                            autoPlay={false}
                                            showArrows={true}
                                            arrows={{color: "black"}}
                                            showIndicators={false}
                                            showStatus={false}
                                            onChange={(index) => setCurrentIndex(index)}
                                        />
                                        <Button
                                            ref={nextStepButtonRef}
                                            className={"btn-next-page"}
                                            type="primary"
                                            onClick={goToNextStep}
                                        >
                                            下一步：对比&投票
                                        </Button>
                                    </>
                                ) : <></>}
                                {
                                    option === "chooseByAcademy" ? (
                                        <div>
                                            <NavBackButton callBack={()=>{
                                                setOption(null)
                                            }}/>
                                            <Title level={2}>基于书院选择教练</Title>
                                            <Text>请选择您心仪的书院，我们将为您展示所属教练</Text>
                                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                              {["金院", "蓝院", "绿院", "白院"].map((academy) => (
                                                <Card
                                                  key={academy}
                                                  hoverable
                                                  style={{ width: 200, backgroundColor:ACADEMY_TO_BACKGROUND_COLOR_MAPPING[academy] }}
                                                  onClick={() => {
                                                    apiClient.get('/teachers').then(res => {
                                                      const resData = res.data;
                                                      const filtered = resData.data.filter(coach => coach.houseName === academy);
                                                      setData(filtered);
                                                      setOption("chooseByCoach");
                                                    });
                                                  }}
                                                >
                                                  <Card.Meta title={academy} description={`${academy} 所属教练`} />
                                                </Card>
                                              ))}
                                            </div>
                                        </div>
                                    ) : <></>
                                }
                            </>
                    </Layout.Content>
                    <Tour open={openTour} onClose={() => setOpenTour(false)} steps={steps}/>
        </App>
    );
}
