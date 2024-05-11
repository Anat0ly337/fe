import {apiRequests} from "../../shared/api";
import {useEffect, useState} from "react";
import {Button, message, Table, Tag} from "antd";
import {CreatePromocode} from "../../components/modals/CreatePromocode";
import {DeleteOutlined} from "@ant-design/icons";



const PromocodesPage = () => {
    const [promocodes, setPromocodes] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 250
        }
    })

    const getData = async () => {
        await apiRequests.promocode.getAll()
            .then((res) => {
                setPromocodes(res.data.promocodes)
                setPagination({
                    pagination: {
                        ...tablePagination,
                        total: res.data.count
                    }
                })
            })
            .catch((e) => message.error('Произошла ошибка'))
    }

    const handleDelete = async (id) => {
        await apiRequests.promocode.delete(id)
            .then((res) => {
                setPromocodes(prev => [...prev].filter(i => i.id !== id))
                message.success('Промокод успешно удалён')
            }).catch(() => message.error('Произошла ошибка'))
    }

    const columns = [
        {
            title: 'Код',
            dataIndex: 'promocodeNumber',
            key: 'promocodeNumber',
        },
        {
            title: 'Срок действия',
            dataIndex: 'period',
            key: 'period',
        },
        {
            title: 'Дата активации',
            dataIndex: 'activateDate',
            key: 'activateDate',
            render: (_, record) => (
                <p>{!record.activateDate ? 'Не активирован' : record.activateDate}</p>
            )
        },
        {
            title: 'Статус',
            dataIndex: 'activated',
            key: 'activated',
            render: (_, record) => (
                <Tag color={!record.activated ? 'red' : 'geekblue'}>{!record.activated ? 'Не активен' : 'Активен'}</Tag>
            )
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
            )
        },
    ]

    useEffect(() => {
        getData()
    }, []);

    const handlePagination = (params) => {
        apiRequests.users.get(10, params.current - 1)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                setPromocodes(res.data.promocodes)
            })
    }

    return (
        <>
            <CreatePromocode updateRow={(i) => setPromocodes(prev => [...prev, i])} />
            <Table
                onChange={handlePagination}
                pagination={tablePagination}
                dataSource={promocodes}
                columns={columns}
            />
        </>
    )
}

export default PromocodesPage