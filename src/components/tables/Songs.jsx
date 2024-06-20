import {Button, Image, Popover, Space, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {TextSong} from "../modals/TextSong";
import {useEffect, useState} from "react";
import {axiosInstance} from "../../shared/axiosInstance";
import {Link} from "react-router-dom";
import ImageColumn from "../../shared/ui/ImageColumn";
import {SongAdditionalActions} from "../../shared/ui/SongAdditionalActions";


export const SongsTable = ({songs, handleTable, pagination, updateHandler, deleteHandler, additionalColumns = [], setSongs, isLoading}) => {
    const [currentSong, setSong] = useState('')
    const [cacheSong, setCacheSong] = useState()
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
                <Popover content={<SongAdditionalActions song={record} />}>
                    <Button type={'link'}>{record.name}</Button>
                </Popover>
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
        ...additionalColumns,
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link state={{data: record}} to={`/songs/edit/${record.id}`}>
                        <Button icon={<EditOutlined />} />
                    </Link>
                    <Button onClick={() => deleteHandler(record.id)} danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ]

    return (
        <Table
            loading={isLoading}
            columns={columns}
            onChange={handleTable}
            pagination={pagination}
            dataSource={songs}
            // onChange={handlePagination}
        />
    )
}