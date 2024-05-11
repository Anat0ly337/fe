import { useEffect, useState } from "react"
import { apiRequests } from "../../shared/api"
import {Button, Form, Image, Input, message, Pagination, Popover, Space, Spin, Table} from "antd"
import EditSong from "../../components/modals/EditSong"
import LoadSong from "../../components/modals/LoadSong"
import {useDispatch} from "react-redux";
import {setAlbums, setAuthors} from "../../store/main";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {LoadAuthor} from "../../components/modals/LoadAuthor";
import {LoadAlbum} from "../../components/modals/LoadAlbum";
import Paragraph from "antd/es/typography/Paragraph";
import {SongsTable} from "../../components/tables/Songs";
import {axiosInstance} from "../../shared/axiosInstance";
import {parsePage} from "../../shared/utils/parsePage";

const SongsPage = () => {
    const [songs, setSongs] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 250
        }
    })
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const deleteHandle = async (id) => {
        await apiRequests.media.delete(id)
            .then((res) => {
                setSongs((prev) => prev.filter((i) => i.id !== id))
                message.success('Трек успешно удален')
            })
            .catch((e) => {
                message.error('Произошла ошибка')
            })
    }

    const getData = async () => {
        setLoading(true)
        Promise.all([apiRequests.media.get(0, 10), apiRequests.media.allAuthors(), apiRequests.media.allAlbums()])
            .then(async ([res1, res2, res3]) => {
                setPagination({
                    ...tablePagination,
                    total: res1.data.totalCount
                })
                dispatch(setAuthors(res2.data))
                dispatch(setAlbums(res3.data))
                return res1.data.searchData.songs
            })
            .then((res) => {
                res.map(i => {
                    axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${i.songImageUri}`, {
                        responseType: 'blob'
                    })
                        .then((data) => {
                            const imageUrl = URL.createObjectURL(data.data)
                            setSongs(prev => [...prev, {
                                ...i, blobUrl: imageUrl
                            }])
                        })
                })
            })
            .catch(() => {
                message.error('Произошла ошибка')
            })
    }

    const updateHandler = (newItem) => {
        setSongs(prev => [...prev].map(i => {
            if (i.id === newItem.id) {
                return newItem
            } else {
                return i
            }
        }))
    }

    const handlePagination = async ({current, pageSize}) => {
        const page = parsePage(current)
        setLoading(true)
        await apiRequests.media.get(page, pageSize)
            .then((res) => {
                setSongs(res.data.searchData.songs)
                setLoading(false)
            })

    }

    useEffect(() => {
        getData()
    }, [])

    const handleSearch = async (val) => {
        if (!val.search) {
            await apiRequests.media.get(0, 10)
                .then((res) => {
                    setPagination({
                        ...tablePagination,
                        total: res.data.totalCount
                    })
                    setSongs([])
                    return res.data.searchData.songs
                })
                .then((res) => {
                    res.map(i => {
                        axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${i.songImageUri}`, {
                            responseType: 'blob'
                        })
                            .then((data) => {
                                const imageUrl = URL.createObjectURL(data.data)
                                setSongs(prev => [...prev, {
                                    ...i, blobUrl: imageUrl
                                }])
                            })
                    })
                })
        } else {
            await apiRequests.media.search(val.search)
                .then((res) => {
                    setPagination({
                        ...tablePagination,
                        total: res.data.searchCount
                    })
                    setSongs([])
                    return res.data.songs
                })
                .then((res) => {
                    res.map(i => {
                        axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${i.songImageUri}`, {
                            responseType: 'blob'
                        })
                            .then((data) => {
                                const imageUrl = URL.createObjectURL(data.data)
                                setSongs(prev => [...prev, {
                                    ...i, blobUrl: imageUrl
                                }])
                            })
                    })
                })
        }

    }

    return (
        <>
            <Space style={{marginBottom: '20px'}}>
                <LoadAuthor />
                <LoadSong updateRow={(i) => setSongs(prev => [...prev, i])} />
                <LoadAlbum />
            </Space>
            <Form
                onFinish={handleSearch}
            >
                <Form.Item name={'search'}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button icon={<SearchOutlined />} htmlType={'submit'}>Поиск</Button>
                </Form.Item>
            </Form>
            <SongsTable
                handleTable={handlePagination}
                songs={songs}
                deleteHandler={deleteHandle}
                pagination={tablePagination}
                updateHandler={updateHandler}
                setSongs={setSongs}
            />

        </>
    )
}

export default SongsPage