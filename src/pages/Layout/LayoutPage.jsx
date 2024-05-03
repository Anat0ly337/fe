import {Layout, Menu, message, Spin} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {Suspense, useEffect} from "react";
import Cookies from "js-cookie";
import main, {setAuth} from "../../store/main";
import {apiRequests} from "../../shared/api";


const LayoutPage = () => {
    const navigate = useNavigate()
    const {mainSlice} = useSelector(state => state)
    const dispatch = useDispatch()


    const menuItems = [
        {
            key: 'logout',
            label: 'Выйти',
            icon:  <LogoutOutlined />
        },

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

    const handleLink = async (link) => {
        if (link.key === 'logout') {
            await apiRequests.logout()
                .then((res) => {
                    sessionStorage.removeItem('accessToken')
                    dispatch(setAuth(false))
                })
                .catch(() => message.error('Произошла ошибка'))
        } else {
            navigate(link.key)
        }
    }

    // useEffect(() => {
    //     const token = Cookies.get('jwtToken')
    //     if (!token) {
    //         dispatch(setAuth(false))
    //     }
    //     console.log(token)
    // }, [mainSlice.isAuth]);
    if (!mainSlice.isAuth) return <Navigate to={'/auth'} />

    return (
        <>
            <Layout style={{height: '100vh'}}>
                <Sider>
                    <Menu
                        style={{height: '100vh'}}
                        onClick={handleLink}
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