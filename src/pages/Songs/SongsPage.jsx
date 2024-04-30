import { useEffect, useState } from "react"
import { apiRequests } from "../../shared/api"
import {Button, Image, message, Popover, Space, Table} from "antd"
import EditSong from "../../components/modals/EditSong"
import LoadSong from "../../components/modals/LoadSong"
import {useDispatch} from "react-redux";
import {setAlbums, setAuthors} from "../../store/main";
import {DeleteOutlined} from "@ant-design/icons";
import {LoadAuthor} from "../../components/modals/LoadAuthor";
import {LoadAlbum} from "../../components/modals/LoadAlbum";

const SongsPage = () => {
    const [songs, setSongs] = useState([])
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

    useEffect(() => {
            Promise.all([apiRequests.media.get(), apiRequests.media.allAuthors(), apiRequests.media.allAlbums()])
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
                columns={columns}
                dataSource={songs}
            />
        </>
    )
}

export default SongsPage