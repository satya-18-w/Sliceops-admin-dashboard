
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store'
import { Avatar, Badge, Button, Dropdown, Flex, Layout, Menu, Space, theme } from 'antd';
import { BellFilled } from '@ant-design/icons';
import { useState } from 'react';
import { PizzaLogo } from '../icons/PizzaLogo';
import { HomeIcon } from '../icons/Home';
import { UsersIcon } from '../icons/Users';
import { RestaurantsIcon } from '../icons/Restaurants';
import { ProductsIcon } from '../icons/Products';
import { PromosIcon } from '../icons/Promos';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';
import { useLogoutUser } from '../hooks/useLogoutUser';

const { Header, Content, Sider, Footer } = Layout;

const getMenuItems = (role: string) => {
    const items = [
        {
            key: "/",
            icon: <HomeIcon />,
            label: <NavLink to={'/'}>Home</NavLink>
        }
    ];

    if (role === "platform-admin") {
        items.push({
            key: "/restaurants",
            icon: <RestaurantsIcon />,
            label: <NavLink to={'/restaurants'}>Restaurants</NavLink>
        });
        items.push({
            key: "/users",
            icon: <UsersIcon />,
            label: <NavLink to={'/users'}>Users</NavLink>
        });
    } else if (role === "tenant-admin") {
        items.push({
            key: "/users",
            icon: <UsersIcon />,
            label: <NavLink to={'/users'}>Users</NavLink>
        });
        items.push({
            key: "/products",
            icon: <ProductsIcon />,
            label: <NavLink to={'/products'}>Products</NavLink>
        });
        items.push({
            key: "/promos",
            icon: <PromosIcon />,
            label: <NavLink to={'/promos'}>Promos</NavLink>
        });
    } else {
        // manager/employee roles
        items.push({
            key: "/products",
            icon: <ProductsIcon />,
            label: <NavLink to={'/products'}>Products</NavLink>
        });
        items.push({
            key: "/promos",
            icon: <PromosIcon />,
            label: <NavLink to={'/promos'}>Promos</NavLink>
        });
    }

    return items;
}



const Dashboard = () => {

    const { logoutMutate } = useLogoutUser();
    // Protection
    // If user data is in the store then user is logged in else logedout

    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const currentYear = new Date().getFullYear();
    const { user } = useAuthStore();

    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />;

    }
    const items = getMenuItems(user.role);

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className={`logo ${collapsed ? 'collapsed' : ''}`} >
                        {collapsed ? (
                            <PizzaLogo style={{ width: '32px', height: '32px' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <PizzaLogo style={{ width: '32px', height: '32px' }} />
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>PIZZA</span>
                            </div>
                        )}
                    </div>
                    <Menu
                        theme="light"
                        selectedKeys={[location.pathname]}
                        mode="inline"
                        items={items}

                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: '0 16px', background: colorBgContainer }} >
                        <Flex gap="medium" align="center" justify='space-between' >
                            <Space>
                                <Badge text={user?.role === 'platform-admin' ? 'Platform Control' : user?.tenant?.name} status='success' />
                            </Space>
                            <Space size={18}>
                                <Badge dot={true} >
                                    <BellFilled />
                                </Badge>
                                <Dropdown menu={{
                                    items: [
                                        {
                                            key: 'logout',
                                            label: 'Logout',
                                            onClick: () => logoutMutate(),
                                        }
                                    ]
                                }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>

                                </Dropdown>
                            </Space>

                        </Flex>
                    </Header>
                    <Content style={{ margin: '10px 16px' }}>

                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{currentYear} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>


        </div>
    )
}

export default Dashboard