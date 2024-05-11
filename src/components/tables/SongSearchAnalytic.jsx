import {useMemo, useState} from "react";
import {Popover, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {apiRequests} from "../../shared/api";
import dayjs from "dayjs";
import {getCurrentMonth} from "../../shared/utils/getCurrentMonth";
import {TableStatistic} from "../../shared/ui/TableStatistic";


export const SongSearchAnalytic = ({date}) => {
    const [songs, setSongs] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 0
        }
    })

    useMemo(async () => {
        const {date_from, date_to} = getCurrentMonth()

        if (date.dateFrom || date.dateTo) {
            await apiRequests.statistics.songSearchAnalytic(
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
                    const newItems = res.data.searchdata.map(i => ({
                        searchRequestCount: i.seenCount,
                        ...i.song
                    }))
                    setSongs(newItems)
                })
                .catch(() => {

                })
        }

    }, [date.dateFrom, date.dateTo]);

    const handlePagination = (params) => {
        const {date_from, date_to} = getCurrentMonth()

        apiRequests.statistics.songSearchAnalytic(
            date ? {...date} : {
            dateFrom: dayjs(new Date(date_from * 1000)).format('YYYY-MM-DD'),
            dateTo: dayjs(new Date(date_to * 1000)).format('YYYY-MM-DD')
        }, params.current - 1, 10)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                const newItems = res.data.searchdata.map(i => ({
                    searchRequestCount: i.seenCount,
                    ...i.song
                }))
                setSongs(newItems)
            })
    }

    return (
        <>
            <TableStatistic
                data={songs}
                columnsProps={[
                    {
                        title: 'Кол-во поисков',
                        dataIndex: 'searchRequestCount',
                        key: 'searchRequestCount',
                    }
                ]}
                pagination={tablePagination}
                onChange={handlePagination}
            />
            {/*<Table*/}
            {/*    dataSource={songs}*/}
            {/*    columns={columns}*/}
            {/*/>*/}
        </>
    )
}