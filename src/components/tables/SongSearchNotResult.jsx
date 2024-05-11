import {useMemo, useState} from "react";
import {Popover, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {apiRequests} from "../../shared/api";
import dayjs from "dayjs";
import {getCurrentMonth} from "../../shared/utils/getCurrentMonth";


export const SongSearchNotResult = ({date}) => {
    const [songs, setSongs] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 0
        }
    })

    const columns = [
        {
            title: 'Введёный текст',
            dataIndex: 'inputText',
            key: 'inputText'
        },
        {
            title: 'Дата поиска',
            dataIndex: 'requestDate',
            key: 'requestDate'
        }
    ]

    useMemo(async () => {
        const {date_from, date_to} = getCurrentMonth()
        if (date.dateFrom || date.dateTo) {
            await apiRequests.statistics.songSearchNotResult(
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
                    setSongs(res.data.data.map(i => (
                        {
                            ...i,
                            requestDate: dayjs(i.requestDate).format('YYYY-MM-DD')
                        }
                    )))
                })
        }

    }, [date.dateFrom, date.dateTo]);

    const handlePagination = (params) => {
        const {date_from, date_to} = getCurrentMonth()

        apiRequests.statistics.songSearchNotResult(
            date ? {...date} : {
                dateFrom: dayjs(new Date(date_from * 1000)).format('YYYY-MM-DD'),
                dateTo: dayjs(new Date(date_to * 1000)).format('YYYY-MM-DD')
            }, params.current - 1, 10)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                setSongs(res.data.data.map(i => (
                    {
                        ...i,
                        requestDate: dayjs(i.requestDate).format('YYYY-MM-DD')
                    }
                )))
            })
    }

    return (
        <>
            <Table
                dataSource={songs}
                columns={columns}
                pagination={tablePagination}
                onChange={handlePagination}
            />
        </>
    )
}