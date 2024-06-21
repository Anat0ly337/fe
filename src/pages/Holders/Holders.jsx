import {Button, Image, Popconfirm, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiRequests} from "../../shared/api";
import {axiosInstance} from "../../shared/axiosInstance";
import Paragraph from "antd/es/typography/Paragraph";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {setHolders} from "../../store/main";


const Holders = () => {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const {mainSlice} = useSelector(state => state)
    useEffect(() => {
        setLoading(true)
        const urls = mainSlice.holders.map((i) => {
            return axiosInstance.get(`/api/v1/media/${i.holderLogoImageAwsUuid}`, {
                responseType: 'blob'
            })
        })
        Promise.all(urls)
            .then((res) => {
                console.log(res)
                setData(mainSlice.holders?.map((i, index) => ({
                    ...i,
                    image: URL.createObjectURL(res[index].data)
                })))
            })
            .finally(() => setLoading(false))
    }, [mainSlice.holders])

    const handleDelete = async (id) => {
        await apiRequests.holders.delete(id)
            .then((res) => {
                dispatch(setHolders(mainSlice.holders.filter(i => i.id !== id)))
            })
    }

    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <Image width={110} src={record.image} />
            )
        },
        {
            title: 'ФИО',
            dataIndex: 'holderFullName',
            key: 'holderFullName',
            render: (row, record) => (
                <>
                    <Link to={`/songs/holder/${record.id}`}>
                        <Button type={'link'}>{row}</Button>
                    </Link>
                </>
            )
        },
        {
            title: 'Почта',
            dataIndex: 'holderEmail',
            key: 'holderEmail'
        },
        {
            title: 'Общая сумма',
            dataIndex: 'totalSumByHolder',
            key: 'totalSumByHolder',
            render: (_, record) => <p>{_.toFixed(2)}</p>
        },
        {
            title: 'Цена за 1 воспроизведение',
            dataIndex: 'priceByOnePlay',
            key: 'priceByOnePlay',
            render: (_, record) => <p>{_.toFixed(2)}</p>
        },
        {
            title: 'Общее кол-во просмотров',
            dataIndex: 'totalSeenCount',
            key: 'totalSeenCount',
        },
        {
            title: 'Действие',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Link to={`/holders/edit/${record.id}`}>
                        <Button icon={<EditOutlined />} />
                    </Link>
                    <Button onClick={() => handleDelete(record.id)} danger={true} icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ]

    return (
        <>
            <Table loading={isLoading} dataSource={data} columns={columns} />
        </>
    )
}

export default Holders