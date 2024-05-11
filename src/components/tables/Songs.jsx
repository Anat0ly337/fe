import {Button, Image, Popover, Space, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import EditSong from "../modals/EditSong";
import {DeleteOutlined} from "@ant-design/icons";
import {TextSong} from "../modals/TextSong";
import {useEffect, useRef, useState} from "react";
import {axiosInstance} from "../../shared/axiosInstance";


export const SongsTable = ({songs, handleTable, pagination, updateHandler, deleteHandler, additionalColumns = [], setSongs}) => {
    const [song, setSong] = useState('')
    const [cacheSong, setCacheSong] = useState()
    const audioRef = useRef()
    const handleSong = async (check, data) => {
        if (cacheSong === data) {
            return null;

        } else {
            if (check) {
                await axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${data}`, {
                    responseType: 'blob'
                })
                    .then((res) => {
                        const imageUrl = URL.createObjectURL(res.data)
                        setSong(imageUrl)
                        setCacheSong(data)
                        audioRef.current.onplay = () => {
                            console.log('opa')
                            audioRef.current.style = `position: relative; top: 0`
                        }
                    })
            }
        }
    }

    const getSongNotes = async (url) => {
        await axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${url}`, {
            responseType: 'blob'
        })
            .then((res) => {
                const imageUrl = URL.createObjectURL(res.data)
                const link = document.createElement('a');
                console.log(res.data)
                link.href = imageUrl;
                link.setAttribute('download', 'note.mid');
                document.body.appendChild(link);
                link.click();
                link.remove()
            })
    }

    useEffect(() => {

        window.addEventListener('', () => {
            console.log('play')
        })
    }, [])

    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'songImageUri',
            key: 'songImageUri',
            width: '200px',
            render: (_, record) => {
                return <Image src={`${record.blobUrl}`} width={150}/>
            }
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <Popover
                        onOpenChange={(check) => {
                            handleSong(check, record.songUri)
                        }}
                        title={'Запись'}
                        content={
                            <Space direction={'vertical'}>
                                <audio ref={audioRef} controls src={song} />
                                <Button onClick={() => getSongNotes(record.notesUri)}>Скачать ноты</Button>
                                <TextSong url={record.songTextUri} />
                            </Space>
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
        ...additionalColumns,
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <EditSong updateRow={updateHandler} data={record} />
                    <Button onClick={() => deleteHandler(record.id)} danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ]

    return (
        <Table
            // loading={isLoading}
            columns={columns}
            onChange={handleTable}
            pagination={pagination}
            dataSource={songs}
            // onChange={handlePagination}
        />
    )
}