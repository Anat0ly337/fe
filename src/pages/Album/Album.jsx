import {Image, Table} from "antd";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {axiosInstance} from "../../shared/axiosInstance";


const AlbumPage = () => {
    const [data, setData] = useState()
    const [isLoading, setLoading] = useState(false)
    const {mainSlice} = useSelector(state => state)

    useEffect(() => {
        setLoading(true)
        const urls = mainSlice.albums.map((i) => {
            if (i.albumImageAwsUuid) {
                return axiosInstance.get(`/api/v1/media/${i.albumImageAwsUuid}`, {
                    responseType: 'blob'
                })
            }

        })
        Promise.all(urls)
            .then((res) => {
                console.log(res)
                setData(mainSlice.albums.map((i, index) => ({
                    ...i,

                    image: res[index] &&  URL.createObjectURL(res[index].data)
                })))
            })
            .finally(() => setLoading(false))
    }, []);

    const columns = [
        {
            key: 'image',
            dataIndex: 'image',
            title: 'Изображение',
            render: (row, record) => <Image width={120} src={row} />
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название'
        },
        {
            key: 'genre',
            dataIndex: 'genre',
            title: 'Жанр'
        },
        {
            key: 'author',
            dataIndex: 'author',
            title: 'Автор',
            render: (row, record) => <p>{row.authorFullName}</p>
        },
    ]

    return (
        <>
            <Table loading={isLoading} dataSource={data} columns={columns} />
        </>
    )
}

export default AlbumPage