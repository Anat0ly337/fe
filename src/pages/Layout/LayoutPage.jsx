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
        }
    ]

    return (
        <>
            <Layout>
                <Sider>
                    <Menu
                        onClick={(i) => navigate(i.key)}
                        items={menuItems}
                    />
                </Sider>

                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </>
    )
}

export default LayoutPage