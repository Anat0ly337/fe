import {apiRequests} from "../../shared/api";
import {useEffect, useState} from "react";
import {message, Table} from "antd";
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
            title: 'Номер',
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