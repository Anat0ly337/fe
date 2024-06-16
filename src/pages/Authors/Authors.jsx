import {Image, Table} from "antd";
import {useSelector} from "react-redux";


const AuthorsPage = () => {
    const {mainSlice} = useSelector(state => state)

    const columns = [
        {
            key: 'id',
            width: '7%',
            dataIndex: 'id',
            title: 'ID'
        },
        {
            key: 'authorFullName',
            dataIndex: 'authorFullName',
            title: 'Имя автора'
        }
    ]

    return (
        <>
            <Table dataSource={mainSlice.authors} columns={columns} />
        </>
    )
}

export default AuthorsPage