import {Button, message, Space, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import ImageColumn from "../../shared/ui/ImageColumn";
import { Link } from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {apiRequests} from "../../shared/api";
import {setCollection} from "../../store/main";


const Collection = () => {
    const { mainSlice } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleDelete = async (id) => {
        await apiRequests.collection.delete(id)
            .then((res) => {
                dispatch(setCollection(mainSlice.collection.filter((i) => i.id !== id)))
                message.success('Коллекция успешно удалена')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    const columns = [
        {
            key: 'collectionImageAwsUuid',
            dataIndex: 'collectionImageAwsUuid',
            title: 'Изображение',
            width: '200px',
            render: (row, render) => <ImageColumn id={row} />
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            render: (_, record) => <Link to={`/collection/${record.id}`}><Button type="link">{record.name}</Button></Link>
        },
        {
            key: 'description',
            dataIndex: 'description',
            title: 'Описание'
        },
        {
            key: 'dateAdd',
            dataIndex: 'dateAdd',
            title: 'Дата добавления'
        },
        {
            key: 'actions',
            title: 'Действия',
            render: (_, record) => (
                <Space>
                    <Link to={`/collection/edit/${record.id}`}><Button icon={<EditOutlined />} /></Link>
                    <Button onClick={() => handleDelete(record.id)} danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ]

    return (
        <>
            <Table columns={columns} dataSource={mainSlice.collection} />
        </>
    )
}

export default Collection