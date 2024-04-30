import {Space, Table, Tag} from "antd";
import {EditUser} from "../../components/modals/EditUser";
import UserActivities from "../../components/modals/UserActivities";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import dayjs from "dayjs";
import {Advertisement} from "../../components/modals/Advertisement";
import {CreateContract} from "../../components/modals/CreateContract";


const AdvertisementPage = () => {
    const [data, setData] = useState([])
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
                <Advertisement data={record} />
            )
        }
    ]

    useEffect(() => {
        const getData = async () => {
            await apiRequests.advertisement.getAll()
                .then((res) => {
                    setData(res.data)
                    console.log(res)
                })
        }

        getData()
    }, []);

    return (
        <>
            <CreateContract />
            <Table
                dataSource={data}
                columns={columns}
            />
        </>
    )
}

export default AdvertisementPage