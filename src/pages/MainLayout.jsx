import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BookOutlined, // 课程管理图标
    UsergroupAddOutlined, // 讲师管理图标
    TagsOutlined, // Tag管理图标
    DashboardOutlined, // 仪表盘图标
    UserOutlined, // 添加这个用于Avatar
    VideoCameraOutlined, // 直播预告图标
    FileTextOutlined, // 规则&流程图标
    TeamOutlined, // 选择教练&书院图标
    HeartOutlined, // 我的选择图标
    TrophyOutlined, // 查看结果图标
    BankOutlined, // 书院图标
} from '@ant-design/icons';
import {
    Button,
    Layout,
    Menu,
    theme,
    Typography,
    Breadcrumb,
    Avatar,
    Dropdown,
    Space
} from 'antd';
import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import Dashboard from './Dashboard.jsx';


const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 导入仪表盘组件


// 使用新的Dashboard组件
export const AdminDashboardPage = () => (
    <Dashboard/>
);


const AdminLayout = () => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">仪表盘</Link>,
        },
        {
            key: '/rules',
            icon: <FileTextOutlined />,
            label: <Link to="/rules">规则&流程</Link>,
        },
        {
            key: '/selection',
            icon: <TeamOutlined />,
            label: <Link to="/selection">选择教练&书院</Link>,
            // children: [
            //     {
            //         key: '/selection/coaches',
            //         icon: <UsergroupAddOutlined />,
            //         label: <Link to="/selection/coaches">基于教练选择书院</Link>,
            //     },
            //     {
            //         key: '/selection/house',
            //         icon: <BankOutlined />,
            //         label: <Link to="/selection/house">基于书院选择教练</Link>,
            //     }
            // ]
        },
        {
            key: '/my-choices',
            icon: <HeartOutlined />,
            label: <Link to="/my-choices">我的选择</Link>,
        },
        {
            key: '/results',
            icon: <TrophyOutlined />,
            label: <Link to="/results">查看结果</Link>,
        },
    ];
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

        let labelText = 'Home';

        if (url === '/') {
            labelText = 'Home';
        }
        else {

            const currentTopLevelMenu = menuItems.find(item => url.startsWith(item.key));
            if (currentTopLevelMenu) {
                labelText = currentTopLevelMenu.label.props.children;
            }
        }
        return {
            key: url,
            title: <Link to={url}>{labelText}</Link>,
        };
    });
    const breadcrumbFinalItems = [{ title: <Link to="/">Home</Link> }].concat(breadcrumbItems.filter(item => item.key !== '/'));

    const userMenuItems = [
        {
            key: 'logout',
            label: '退出登录',
            onClick: () => {
                localStorage.clear()
                navigate("/login")
                console.log('User logged out');

            },
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px', textAlign: 'center', lineHeight: '32px', color: 'white', fontWeight: 'bold' }}>
                    {collapsed ? '探月' : '探月教育管理系统'}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/dashboard']}
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: collapsed ? 80 : 200,
                    transition: 'margin-left 0.2s'
                }}
            >
                <Header
                    style={{
                        padding: '0 16px',
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky', // 固定Header
                        top: 0, // 固定在顶部
                        zIndex: 1, // 确保Header在Content之上
                        width: '100%' // 确保Header宽度正确
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Space>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Button type="text" style={{ color: 'inherit' }}>Student User</Button>
                        </Dropdown>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbFinalItems} />
                    <div
                        style={{
                            position:"relative",
                            padding: 24,
                            minHeight: 'calc(100vh - 180px)',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
