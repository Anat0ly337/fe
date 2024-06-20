import { useEffect, useState } from "react"
import { apiRequests } from "../../shared/api"
import {Button, Flex, Form, Image, Input, message, Pagination, Popover, Space, Spin, Table, Tag} from "antd"
import {useDispatch, useSelector} from "react-redux";
import {DeleteOutlined, EditOutlined, SearchOutlined} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import {SongsTable} from "../../components/tables/Songs";
import {axiosInstance} from "../../shared/axiosInstance";
import {parsePage} from "../../shared/utils/parsePage";
import {Link, useSearchParams} from "react-router-dom";
import Title from "antd/es/typography/Title";
import ImageColumn from "../../shared/ui/ImageColumn";
import {TextSong} from "../../components/modals/TextSong";
import {SongAdditionalActions} from "../../shared/ui/SongAdditionalActions";

const SongsPage = () => {
    const [songs, setSongs] = useState(null)
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 250
        }
    })
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const {mainSlice} = useSelector(state => state)
    const [searchParams, setSearchParams] = useSearchParams()

    const deleteHandler = async (id) => {
        await apiRequests.media.delete(id)
            .then((res) => {
                setSongs((prev) => prev.filter((i) => i.id !== id))
                message.success('Трек успешно удален')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }



    const handlePagination = async ({current, pageSize}) => {
        const page = parsePage(current)
        setLoading(true)
        await apiRequests.media.get(page, pageSize)
            .then((res) => {
                setSongs(res.data.searchData.songs.map(i => ({song: i})))
                setLoading(false)
            })

    }

    const columnsAuthor = [
        {
            key: 'authorFullName',
            dataIndex: 'authorFullName',
            title: 'Имя автора',
            render: (row, record) => (
                <>
                    <Link to={`/songs/author/${record.id}`} >{row}</Link>
                </>
            )
        }
    ]

    const query = async (requestUrl, value) => {
        if (value) {
            await requestUrl(value)
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
                                setSongs(prev => [...prev, i])
                            })
                    })
                })
        } else {
            await requestUrl(0, 10)
                .then((res) => {
                    setPagination({
                        ...tablePagination,
                        total: res.data.totalCount
                    })
                    setSongs(res.data.searchData.songs)
                    return res.data.searchData.songs
                })
        }
    }

    const handleSearch = async (val) => {
        if (!val.search) {
            if (val.search_by_file ) {
                await query(apiRequests.media.searchByFile, val.search_by_file)

            } else {
                await query(apiRequests.media.get)

            }
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
                    const queries = res.map(i => {

                        return axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${i.songImageUri}`, {
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

    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'songImageUri',
            key: 'songImageUri',
            width: '200px',
            render: (_, record) => {
                return <ImageColumn id={{url: record?.songImageUri}} />
            }
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <Popover
                        title={'Запись'}
                        content={
                            <SongAdditionalActions song={record} />
                        }

                    >
                        <Paragraph style={{color: '#1677ff'}} >{record.name}</Paragraph>
                    </Popover>
                </>
            )
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
            render: (_, record) => (
                <>
                    {
                        record.author.map(i => <p key={i}>{i}</p>)
                    }
                </>

            )
        },
        {
            title: 'Жанр',
            dataIndex: 'genre',
            key: 'genre',
            render: (_, record) => (
                <p>{record.genre}</p>
            )
        },
        {
            title: 'Альбом',
            dataIndex: 'album',
            key: 'album',
            render: (_, record) => (
                <p>{record.album}</p>
            )
        },
        {
            title: 'Рейтинг',
            dataIndex: 'rating',
            key: 'rating',
            render: (_, record) => (
                <p>{record.rating || 0}</p>
            )
        },
        {
            title: 'Год выпуска',
            dataIndex: 'yearIssue',
            key: 'yearIssue',
            render: (_,record) => (
                <p>{record.yearIssue}</p>
            )
        },
        {
            title: 'Теги',
            dataIndex: 'tags',
            key: 'tags',
            render: (_, record) => {
                const tags = record.tags?.split(',').filter((i) => i !== '')

                if (tags && tags.length > 0) {
                    return (
                        <Flex wrap={'wrap'} gap={6}>
                            {
                                tags.map((i) => (
                                    <Tag key={i} color={'geekblue'}>{i}</Tag>
                                ))
                            }
                        </Flex>
                    )
                }

            }
        },
        {
            title: 'Название файла',
            dataIndex: 'tags',
            key: 'tags',
            render: (_, record) => <Paragraph>{record.originalFileName}</Paragraph>
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/songs/edit/${record.id}`}>
                        <Button icon={<EditOutlined />} />
                    </Link>
                    <Button onClick={() => deleteHandler(record.id)} danger icon={<DeleteOutlined />} />
                </Space>
            )
        }]

    return (
        <>
            <Form
                onFinish={handleSearch}
            >
                <Form.Item name={'search'}>
                    <Input placeholder={'Полнотекстовый текст'} />
                </Form.Item>
                <Form.Item name={'search_by_file'}>
                    <Input placeholder={'Поиск по названию файла трека'} />
                </Form.Item>
                <Form.Item>
                    <Button icon={<SearchOutlined />} htmlType={'submit'}>Поиск</Button>
                </Form.Item>
            </Form>
            {
                songs !== null ? (
                    <Table
                        pagination={{
                            pageSize: 5
                        }}
                        columns={columns}
                        dataSource={songs}
                    />
                ) : (
                    <Table
                        dataSource={mainSlice.authors}

                        columns={columnsAuthor}
                    />
                )
            }



        </>
    )
}

export default SongsPage