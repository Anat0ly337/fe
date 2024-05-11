import {Button, message, Space, Table, Tag} from "antd";
import {EditUser} from "../../components/modals/EditUser";
import UserActivities from "../../components/modals/UserActivities";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import dayjs from "dayjs";
import {Advertisement} from "../../components/modals/Advertisement";
import {CreateContract} from "../../components/modals/CreateContract";
import {DeleteOutlined} from "@ant-design/icons";


const AdvertisementPage = () => {
    const [data, setData] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 250
        }
    })

    const handleDelete = async (id) => {
        await apiRequests.advertisement.delete(id)
            .then((res) => {
                setData(prev => [...prev].filter(i => i.id !== id))
                message.success('Контракт успешно удалён')
            }).catch(() => message.error('Произошла ошибка'))
    }


    const columns = [
        {
            title: 'Имя заказчика',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Принявший',
            dataIndex: 'adminLoginIssuer',
            key: 'adminLoginIssuer',
        },
        {
            title: 'Длительность',
            dataIndex: 'contract_duration',
            key: 'contract_duration',
            render: (_, record) => (
                <p>{record.contract_duration} {record.contract_duration_measure}</p>
            )
        },
        {
            title: 'Дата начала действия',
            dataIndex: 'dateStartCampaign',
            key: 'dateStartCampaign',
            render: (_, record) => (
                <p>{dayjs(record.dateStartCampaign).format('DD MMMM YYYY')}</p>
            )
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Advertisement data={record} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ]

    useEffect(() => {
        const getData = async () => {
            await apiRequests.advertisement.getAll()
                .then((res) => {
                    setPagination({
                        pagination: {
                            ...tablePagination,
                            total: res.data.count
                        }
                    })
                    setData(res.data.advertisements)
                    console.log(res)
                })
        }

        getData()
    }, []);

    const handlePagination = (params) => {
        apiRequests.advertisement.getAll(10, params.current - 1)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                setData(res.data.advertisements)
            })
    }

    return (
        <>
            <CreateContract updateRow={(i) => setData(prev => [...prev, i])} />
            <Table
                pagination={tablePagination.pagination}
                dataSource={data}
                columns={columns}
                onChange={handlePagination}
            />
        </>
    )
}

export default AdvertisementPage