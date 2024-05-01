import {apiRequests} from "../../shared/api";
import {useEffect, useState} from "react";
import {message, Table, Tag} from "antd";
import {CreatePromocode} from "../../components/modals/CreatePromocode";



const PromocodesPage = () => {
    const [promocodes, setPromocodes] = useState([])

    const getData = async () => {
        await apiRequests.promocode.getAll()
            .then((res) => {
                setPromocodes(res.data)
            })
            .catch((e) => message.error('Произошла ошибка'))
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
            title: 'Статус',
            dataIndex: 'activated',
            key: 'activated',
            render: (_, record) => (
                <Tag color={!record.activated ? 'red' : 'geekblue'}>{!record.activated ? 'Не активен' : 'Активен'}</Tag>
            )
        },
    ]

    useEffect(() => {
        getData()
    }, []);

    return (
        <>
            <CreatePromocode updateRow={(i) => setPromocodes(prev => [...prev, i])} />
            <Table
                dataSource={promocodes}
                columns={columns}
            />
        </>
    )
}

export default PromocodesPage