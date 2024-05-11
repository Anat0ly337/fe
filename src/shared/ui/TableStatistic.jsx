import {Popover, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {apiRequests} from "../api";
import {useState} from "react";

export const TableStatistic = ({ columnsProps = [], data, ...props}) => {


    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
        },
        ...columnsProps,
        {
            title: 'Жанр',
            dataIndex: 'genre',
            key: 'genre'
        },
        {
            title: 'Альбом',
            dataIndex: 'album',
            key: 'album'
        },
        {
            title: 'Рейтинг',
            dataIndex: 'rating',
            key: 'rating',
            render: (_, record) => (
                <p>{record.rating || 0}</p>
            )
        },
        {
            title: 'Год выпуска',
            dataIndex: 'yearIssue',
            key: 'yearIssue'
        }
    ]



    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                {...props}
            />
        </>
    )
}