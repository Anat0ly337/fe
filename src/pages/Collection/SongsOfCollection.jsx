import {Button, Flex, Input, message, Popover, Table, Tag} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { useParams } from "react-router-dom";
import { SongsTable } from "../../components/tables/Songs";
import Title from "antd/es/typography/Title";
import {apiRequests} from "../../shared/api";
import {AppleOutlined, CheckOutlined, PlusOutlined} from "@ant-design/icons";
import debounce from "../../shared/utils/debounce";
import {setCollection} from "../../store/main";



const additionalColumns = [
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
    }
]

const SongsOfCollection = () => {
    const [collection, setCurrentCollection] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [newSongs, setNewSongs] = useState(null)
    const dispatch = useDispatch()
    const {mainSlice} = useSelector(state => state)
    const {id} = useParams()


    useEffect(() => {
        const currentCollection = mainSlice.collection.find(i => i.id == id)
        if (currentCollection) setCurrentCollection(currentCollection)
    }, [id])

    const handleDelete = async (idSong) => {
        await apiRequests.collection.deleteSongOfCollection(idSong)
            .then(() => {
                setCurrentCollection(prev => ({
                    ...prev,
                    songs: prev.songs.filter(i => i.id !== idSong)
                }))
                dispatch(
                    setCollection(mainSlice.collection.map((i) => {
                        if (i.id === collection.id) return collection;
                        return i
                    }))
                )
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    const handleSearch = async (val) => {
        setLoading(true)
        if (val === '') {
            setNewSongs(null)
        } else {
            await apiRequests.media.search(val)
                .then((res) => res.data.songs && setNewSongs(res.data.songs))
                .catch((e) => {
                    message.error(e.response.data.message || 'Произошла ошибка')
                })
        }
        setLoading(false)
    }

    const searchHandler = debounce(handleSearch, 700)

    const addSongToCollection = async (song) => {
        await apiRequests.collection.addSong({
            collectionId: collection.id,
            songIds: [`${song.id}`]
        })
            .then((res) => {
                console.log(song)
                const updatedCollection = {
                    ...collection,
                    songs: [...collection.songs, song]
                }
                setCurrentCollection(updatedCollection)
                dispatch(setCollection(mainSlice.collection.map((i) => {
                    if (i.id === res.data.id) return updatedCollection;
                    return i
                })))
            })
    }

    return (
    <>
        <Title>{collection.name}</Title>
        <div style={{margin: '20px 0'}}>
            <Input onChange={(e) => searchHandler(e.target.value)} placeholder={'Название песни'} />
        </div>
        {
            newSongs ? (
                <SongsTable
                    handleTable={() => {}}
                    isLoading={isLoading}
                    songs={newSongs}
                    additionalColumns={additionalColumns}
                    deleteHandler={() => {}}
                    pagination={{}}
                    actions={(_, record) => {
                        const dublicate = collection.songs.find(i => i.id === record.id)
                        if (dublicate) {
                            return (
                                <Popover placement={'left'} title={'Данный трек уже есть в подборке'}>
                                    <Button disabled icon={<CheckOutlined />}/>
                                </Popover>
                            )

                        }
                        return <Button onClick={() => addSongToCollection(record)} icon={<PlusOutlined/>}/>
                        
                    }}
                    updateHandler={() => {}}
                />
            ) : (
                <SongsTable
                    handleTable={() => {}}
                    isLoading={isLoading}
                    songs={collection.songs}
                    additionalColumns={additionalColumns}
                    deleteHandler={handleDelete}
                    pagination={{}}
                    updateHandler={() => {}}
                />
            )
        }
    </>
  )
};

export default SongsOfCollection;
