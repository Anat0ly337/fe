import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {Button, Table} from "antd";
import {EditOutlined} from "@ant-design/icons";


const UsersPage = () => {
    const [users, setUsers] = useState([])

    const columns = [

        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            width: '6%',
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} />
                </>
            ),
        },

    ]

    useEffect(() => {
        apiRequests.users.get()
            .then((res) => {
                const dataUsers = res.data.map((i) => ({
                    name: i.name,
                    id: i.id
                }))

                setUsers(dataUsers)
            })
    }, []);


    return (
        <>
            <Table
                dataSource={users}
                columns={columns}
            />
        </>
    )
}

export default UsersPage