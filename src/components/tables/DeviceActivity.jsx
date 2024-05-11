import {useEffect, useMemo, useState} from "react";
import {apiRequests} from "../../shared/api";
import {Table} from "antd";
import {getCurrentMonth} from "../../shared/utils/getCurrentMonth";
import dayjs from "dayjs";


export const DeviceActivity = ({date}) => {
    const [data, setData] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 0
        }
    })

    useMemo(async () => {
        const { date_from, date_to } = getCurrentMonth()
        if (date.dateFrom || date.dateTo) {
            await apiRequests.statistics.deviceActivity(
                date ? {...date} : {
                    dateFrom: dayjs(new Date(date_from * 1000)).format('YYYY-MM-DD'),
                    dateTo: dayjs(new Date(date_to * 1000)).format('YYYY-MM-DD')
                }
            )
                .then((res) => {
                    setPagination({
                        pagination: {
                            ...tablePagination,
                            total: res.data.count
                        }
                    })
                    setData(res.data.devices)

                })
        }

    }, [date.dateFrom, date.dateTo]);

    // useEffect(() => {
    //     apiRequests.statistics.deviceActivity({
    //         dateFrom: '2024-04-01',
    //         dateTo: '2024-06-01'
    //     })
    //         .then((res) => {
    //             setPagination({
    //                 pagination: {
    //                     ...tablePagination,
    //                     total: res.data.count
    //                 }
    //             })
    //             setData(res.data.devices)
    //         })
    //
    // }, []);

    const columns = [
        {
            title: 'ID устройства',
            dataIndex: 'deviceId',
            key: 'deviceId'
        },
        {
            title: 'Активность устройства',
            dataIndex: 'activityCount',
            key: 'activityCount'
        }
    ]

    const handlePagination = (params) => {
        const {date_from, date_to} = getCurrentMonth()
        console.log(params)
        apiRequests.statistics.deviceActivity(
            date ? {...date} : {
                dateFrom: dayjs(new Date(date_from * 1000)).format('YYYY-MM-DD'),
                dateTo: dayjs(new Date(date_to * 1000)).format('YYYY-MM-DD')
            }, params.current - 1, 10)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                setData(res.data.devices)
            })
    }

    return (
        <>
            <Table
                pagination={tablePagination}
                onChange={handlePagination}
                columns={columns}
                dataSource={data}
            />
        </>
    )
}