import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {apiRequests} from "../../shared/api";
import {Flex, message, Spin, Tag} from "antd";
import {axiosInstance} from "../../shared/axiosInstance";
import {parsePage} from "../../shared/utils/parsePage";
import {SongsTable} from "../../components/tables/Songs";
import Paragraph from "antd/es/typography/Paragraph";
import {useSelector} from "react-redux";


const SongsOfHolders = () => {
    const [songs, setSongs] = useState(null)
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 250
        }
    })
    const { mainSlice } = useSelector(state => state)
    const [isLoading, setLoading] = useState(true)
    const { id } = useParams()

    const deleteHandle = async (id) => {
        await apiRequests.media.delete(id)
            .then((res) => {
                setSongs((prev) => prev.filter((i) => i.song.id !== id))
                message.success('Трек успешно удален')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    useEffect(() => {

    }, []);

    const getData = async () => {
        setLoading(true)
        Promise.all([apiRequests.media.get(0, 10)])
            .then(async ([res1, res2, res3]) => {
                setPagination({
                    ...tablePagination,
                    total: res1.data.totalCount
                })
                return res1.data.searchData.songs
            })
            .then((res) => {
                const isData = []
                res.map((song) => {
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
                console.log(isData)
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
            .catch((e) => {
                message.error(e.response.data.message ||'Произошла ошибка')
            })
            .finally(() => setLoading(false))
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
        const getData = async () => {
            const currentData = mainSlice.holders.find(i => i.id == id)
            console.log(currentData.songsByHolder)

            if (currentData) {
                setSongs(currentData.songsByHolder)
            }
            setLoading(false)
        }
        getData()
    }, [id])

    return (
        <>
            {
                isLoading ? <Spin /> : (
                    <SongsTable
                        handleTable={handlePagination}
                        isLoading={isLoading}
                        songs={songs}
                        additionalColumns={[
                            {
                                title: 'Кол-во прослушиваний',
                                dataIndex: 'seenCount',
                                key: 'seenCount',
                                render: (_, record) => <p>{record.seenCount}</p>
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
                                                        <Tag color={'geekblue'}>{i}</Tag>
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
                        ]}
                        deleteHandler={deleteHandle}
                        pagination={tablePagination}
                        updateHandler={updateHandler}
                        setSongs={setSongs}
                    />
                )
            }

        </>
    )
}

export default SongsOfHolders