import {Layout, Menu} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {Outlet, useNavigate} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";


const LayoutPage = () => {
    const navigate = useNavigate()

    const menuItems = [
        {
            key: 'users',
            label: 'Пользователи',
            icon: <UserOutlined />
        },
        {
            key: 'advertisement',
            label: 'Реклама',
            icon: <UserOutlined />
        },
        {
            key: 'songs',
            label: 'Песни',
            icon: <UserOutlined />
        },
        {
            key: 'statistic',
            label: 'Статистика',
            icon: <UserOutlined />
        },
        {
            key: 'promocode',
            label: 'Промокоды',
            icon: <UserOutlined />
        },
    ]



    return (
        <>
            <Layout style={{height: '100vh'}}>
                <Sider>
                    <Menu
                        style={{height: '100vh'}}
                        onClick={(i) => navigate(i.key)}
                        items={menuItems}
                    />
                </Sider>

                <Content style={{margin: '25px'}}>
                    <Outlet />
                </Content>
            </Layout>
        </>
    )
}

export default LayoutPage