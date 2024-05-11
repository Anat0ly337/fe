import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {getCurrentMonth} from "../../shared/utils/getCurrentMonth";
import dayjs from "dayjs";
import {Card, Space, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";


export const MoneyDistribution = ({date}) => {

    const [data, setData] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 0
        }
    })
    const [wholeSum, setSum] = useState({
        sum: 0,
        percentSum: 0
    })

    useEffect(() => {
        apiRequests.statistics.moneyDistribution({
            dateFrom: '2024-04-01',
            dateTo: '2024-06-01'
        })
            .then((res) => {
                setSum({
                    percentSum: res.data.percentSum,
                    sum: res.data.commonSumm
                })
                setData(res.data.authors)
            })

    }, []);

    const columns = [
        {
            title: 'ID автора',
            dataIndex: 'id',
            key: 'id',
            width: '15%'
        },
        {
            title: 'Имя автора',
            dataIndex: 'authorFullName',
            key: 'authorFullName'
        },

    ]

    const handlePagination = (params) => {
        const {date_from, date_to} = getCurrentMonth()

        apiRequests.statistics.deviceActivity(
            date ? {...date} : {
                dateFrom: dayjs(new Date(date_from * 1000)).format('YYYY-MM-DD'),
                dateTo: dayjs(new Date(date_to * 1000)).format('YYYY-MM-DD')
            }, params.current - 1, 10)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                setData(res.data)
            })
    }

    return (
        <>
            <Card style={{marginBottom: '20px'}} size={"small"} title={'Данные о доходе'}>
                <Paragraph>Доход от подписок: {wholeSum.sum}</Paragraph>
                <Paragraph>Процент авторам: {wholeSum.percentSum}</Paragraph>
            </Card>
            <Table
                pagination={tablePagination}
                onChange={handlePagination}
                columns={columns}
                dataSource={data}
            />
        </>
    )
}