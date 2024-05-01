import { useEffect, useState } from "react"
import { apiRequests } from "../../shared/api"
import {Button, Image, message, Pagination, Popover, Space, Spin, Table} from "antd"
import EditSong from "../../components/modals/EditSong"
import LoadSong from "../../components/modals/LoadSong"
import {useDispatch} from "react-redux";
import {setAlbums, setAuthors} from "../../store/main";
import {DeleteOutlined} from "@ant-design/icons";
import {LoadAuthor} from "../../components/modals/LoadAuthor";
import {LoadAlbum} from "../../components/modals/LoadAlbum";
import Paragraph from "antd/es/typography/Paragraph";

const SongsPage = () => {
    const [songs, setSongs] = useState([])
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
        setLoading(true)
        await apiRequests.media.get(current - 1, pageSize)
            .then((res) => {
                setSongs(res.data.songs)
                setLoading(false)
            })

    }

    useEffect(() => {
            Promise.all([apiRequests.media.get(0, 10), apiRequests.media.allAuthors(), apiRequests.media.allAlbums()])
                .then(([res1, res2, res3]) => {
                    setSongs(res1.data.songs)
                    dispatch(setAuthors(res2.data))
                    dispatch(setAlbums(res3.data))
                })
                .catch(() => {
                    message.error('Произошла ошибка')
                })
    }, [])

    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'songImageUri',
            key: 'songImageUri',
            width: '200px',
            render: (_, record) => (
                <Image src={`https://dligjs37pj7q2.cloudfront.net${record.songImageUri}`} width={150} />
            )
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
                            <audio controls src={`https://dligjs37pj7q2.cloudfront.net${record.songUri}`} />
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
        },
        {
            title: 'Жанр',
            dataIndex: 'genre',
            key: 'genre'
        },
        {
            title: 'Альбом',
            dataIndex: 'album',
            key: 'album'
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
            key: 'yearIssue'
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <EditSong updateRow={updateHandler} data={record} />
                    <Button onClick={() => deleteHandle(record.id)} danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ]

    return (
        <>
            <Space style={{marginBottom: '20px'}}>
                <LoadAuthor />
                <LoadSong updateRow={(i) => setSongs(prev => [...prev, i])} />
                <LoadAlbum />
            </Space>
            <Table
                loading={isLoading}
                columns={columns}
                pagination={{
                    pageSize: 5,
                    total: 50
                }}
                dataSource={songs}
                onChange={handlePagination}
            />
            {/*<Pagination*/}
            {/*    style={{marginTop: '20px'}}*/}
            {/*    onChange={handlePagination}*/}
            {/*    pageSize={5}*/}
            {/*    total={90}*/}
            {/*/>*/}
        </>
    )
}

export default SongsPage