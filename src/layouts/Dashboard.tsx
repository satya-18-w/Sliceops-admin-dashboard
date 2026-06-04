
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store'
import { Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { PizzaLogo } from '../icons/PizzaLogo';
import { HomeIcon } from '../icons/Home';
import { UsersIcon } from '../icons/Users';
import { RestaurantsIcon } from '../icons/Restaurants';
import { ProductsIcon } from '../icons/Products';
import { PromosIcon } from '../icons/Promos';

const { Header, Content, Sider, Footer } = Layout;

const items = [
    {
        key: "/",
        icon: <HomeIcon />,
        label: <NavLink to={'/'}>Home</NavLink>
    },
    {
        key: "/users",
        icon: <UsersIcon />,
        label: <NavLink to={'/users'}>Users</NavLink>
    },
    {
        key: "/restaurants",
        icon: <RestaurantsIcon />,
        label: <NavLink to={'/restaurants'}>Restaurants</NavLink>
    },
    {
        key: "/products",
        icon: <ProductsIcon />,
        label: <NavLink to={'/products'}>Products</NavLink>
    },
    {
        key: "/promos",
        icon: <PromosIcon />,
        label: <NavLink to={'/promos'}>Promos</NavLink>
    }
]

const Dashboard = () => {

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
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '0 16px' }}>

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