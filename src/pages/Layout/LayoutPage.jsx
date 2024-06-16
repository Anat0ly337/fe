import {Layout, Menu, message, Spin} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {
    CustomerServiceOutlined,
    LineChartOutlined,
    LogoutOutlined, PayCircleOutlined, QrcodeOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {Suspense, useEffect, useState} from "react";
import {setAlbums, setAuth, setAuthors, setCollection, setHolders, setSongs} from "../../store/main";
import {apiRequests} from "../../shared/api";


const LayoutPage = () => {
    const navigate = useNavigate()
    const {mainSlice} = useSelector(state => state)
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(true)

    const menuItems = [
        {
            key: 'logout',
            label: 'Выйти',
            icon:  <LogoutOutlined />
        },
        {
            key: 'usersGroup',
            label: 'Пользователи',
            type: 'group',
            children: [
                {
                    key: 'users',
                    label: 'Список пользователей',
                    icon: <UserOutlined />
                },
                {
                    key: 'users/create',
                    label: 'Создать пользователя',
                    icon: <UserOutlined />
                }
            ],
        },
        {
            key: 'songsTable',
            label: 'Песни',
            type: 'group',
            children: [
                {
                    key: 'songs',
                    icon: <CustomerServiceOutlined />,
                    label: 'Список песен'
                },
                {
                    key: 'songs/create',
                    icon: <CustomerServiceOutlined />,
                    label: 'Добавить песню'
                }
            ]
        },
        {
            key: 'holdersGroup',
            label: 'Правообладатели',
            type: 'group',
            children: [
                {
                    key: 'holders',
                    icon: <CustomerServiceOutlined />,
                    label: 'Список правообладателей'
                },
                {
                    key: 'holders/create',
                    icon: <CustomerServiceOutlined />,
                    label: 'Добавить правообладателя'
                }
            ]
        },
        {
            key: 'albumGroup',
            label: 'Альбомы',
            type: 'group',
            children: [
                {
                    key: 'albums',
                    icon: <CustomerServiceOutlined />,
                    label: 'Список альбов'
                },
                {
                    key: 'albums/create',
                    icon: <CustomerServiceOutlined />,
                    label: 'Добавить альбом'
                }
            ]
        },
        {
            key: 'authorsGroup',
            label: 'Авторы',
            type: 'group',
            children: [
                {
                    key: 'authors',
                    icon: <CustomerServiceOutlined />,
                    label: 'Список авторов'
                },
                {
                    key: 'authors/create',
                    icon: <CustomerServiceOutlined />,
                    label: 'Добавить автора'
                }
            ]
        },
        {
            key: 'collectionGroup',
            label: 'Подборки песен',
            type: 'group',
            children: [
                {
                    key: 'collection',
                    icon: <CustomerServiceOutlined />,
                    label: 'Список подборок'
                },
                {
                    key: 'collection/create',
                    icon: <CustomerServiceOutlined />,
                    label: 'Добавить подборку'
                }
            ]
        },
        {
            key: 'statistic',
            label: 'Статистика',
            icon: <LineChartOutlined />
        },
        {
            key: 'promocodes',
            label: 'Промокоды',
            icon: <QrcodeOutlined />
        },
        {
            key: 'advertisement',
            label: 'Реклама',
            icon: <PayCircleOutlined />
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

    useEffect(() => {
        setLoading(true)
        const token = sessionStorage.getItem('accessToken')
        if (token) {
            const getData = () => {
                Promise.all([
                    apiRequests.media.allAuthors(),
                    apiRequests.media.allAlbums(),
                    apiRequests.holders.getAll(),
                    apiRequests.media.get(0, 10),
                    apiRequests.collection.getAll(),
                    apiRequests.users.get()
                ])
                    .then(async ([res1, res2, res3, res4, res5]) => {
                        dispatch(setAuthors(res1.data.authors))
                        dispatch(setAlbums(res2.data.authors))
                        dispatch(setHolders(res3.data.holders))
                        dispatch(setCollection(res5.data))
                        return res4.data.searchData.songs
                    })
                    .then((songs) => {
                        const isData = []
                        songs.map((song) => {
                            song.author.map((author) => {
                                const dublicate = isData.find(i => i.name === author)
                                if (!dublicate) {
                                    isData.push({
                                        name: author,
                                        data: [song]
                                    })
                                } else {
                                    const dublicateID = isData.findIndex(i => i.name === author)
                                    isData[dublicateID] = {
                                        name: isData[dublicateID].name,
                                        data: [...isData[dublicateID].data, song]
                                    }
                                }
                            })
                        })
                        dispatch(setSongs(songs))
                    })
                    .catch((e) => {
                        message.error(e.response.data.message || 'Произошла ошибка')
                    })
                    .finally(() => setLoading(false))
            }
            getData()
        }

    }, [mainSlice.isAuth]);
    if (!mainSlice.isAuth) return <Navigate to={'/auth'} />

    return (
        <>
            <Layout>
                <Sider style={{height: '100vh'}} >
                    <Menu
                        style={{height: '100vh', overflow: 'auto'}}
                        onClick={handleLink}
                        items={menuItems}
                    />
                </Sider>

                <Content style={{margin: '25px'}}>
                    <Suspense fallback={<Spin />}>
                        {
                            !isLoading && <Outlet />
                        }

                    </Suspense>
                </Content>
            </Layout>
        </>
    )
}

export default LayoutPage