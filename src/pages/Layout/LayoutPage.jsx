import {Layout, Menu, Spin} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {Suspense, useEffect} from "react";
import Cookies from "js-cookie";
import main, {setAuth} from "../../store/main";


const LayoutPage = () => {
    const navigate = useNavigate()
    const {mainSlice} = useSelector(state => state)
    const dispatch = useDispatch()

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
            key: 'promocodes',
            label: 'Промокоды',
            icon: <UserOutlined />
        },
    ]

    useEffect(() => {
        const token = Cookies.get('accessToken')
        if (!token) {
            dispatch(setAuth(false))
        }
    }, [mainSlice.isAuth]);

    if (!mainSlice.isAuth) return <Navigate to={'/auth'} />

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
                    <Suspense fallback={<Spin />}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Layout>
        </>
    )
}

export default LayoutPage