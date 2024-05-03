import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {Button, Collapse, Flex, Form, Input, message, Space, Table, Tag} from "antd";
import {EditOutlined, SearchOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {EditUser} from "../../components/modals/EditUser";
import UserActivities from "../../components/modals/UserActivities";
import {SearchUsers} from "../../components/forms/SearchUsers";
import {CreateUser} from "../../components/modals/CreateUser";
import {axiosInstance} from "../../shared/axiosInstance";
import Cookies from "js-cookie";

const UsersPage = () => {
    const [users, setUsers] = useState([])
    const {mainSlice} = useSelector(state => state)
    const { Panel } = Collapse
    const updateColumns = (newItem) => {
        const newData = [...users].map((i) => {
            if (newItem.id === i.id) return newItem
            return i
        })
        setUsers(newData)
    }


    const columns = [
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Дата регистрации',
            dataIndex: 'registeredDate',
            key: 'registeredDate',
        },
        {
            title: 'Статус аккаунта',
            dataIndex: 'accountBlocked',
            key: 'accountBlocked',
            render: (_, {accountBlocked}) => (
                <Tag
                    color={!accountBlocked ? 'green' : 'red'}
                >
                    {!accountBlocked ? 'Разблокирован' : 'Заблокирован'}
                </Tag>
            )
        },
        {
            title: 'Роль',
            dataIndex: 'userRole',
            key: 'userRole',
            render: (_, {userRole}) => (
                <Tag
                    color={userRole === 'USER' ? 'green' : userRole === 'ADMIN' ? 'red' : 'blue'}
                >
                    {userRole}
                </Tag>
            )
        },
        {
            title: 'ID устройства',
            dataIndex: 'deviceId',
            key: 'deviceId'
        },
        {
            title: 'Подписка',
            dataIndex: 'userSubscription',
            key: 'userSubscription',
            render: (_, {userSubscription}) => (
                userSubscription ?
                    <Tag
                        color={'gold'}
                    >
                        {userSubscription.subscriptionPlan}
                    </Tag> :
                    <Tag
                        color={'default'}
                    >
                        Отсутствует
                    </Tag> 
            )
        },
        {
            width: '6%',
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <EditUser updateRow={updateColumns} userData={record} />
                    <UserActivities data={record.userPaymentHistory} />
                </Space>
            ),
        },

    ]

    useEffect(() => {
        apiRequests.users.get()
            .then((res) => {
                setUsers(res.data)
            })
        console.log(Cookies.get('jwtToken'))
        console.log(Cookies.get('accessToken'))
    }, []);


    return (
        <>
            <Collapse ghost>
                <Panel key={1} header={'Фильтры'}>
                    <SearchUsers updateData={setUsers} />
                </Panel>
            </Collapse>
            <CreateUser updateRow={(i) => setUsers(prev => [...prev, i])} />

            <Table
                dataSource={users}
                columns={columns}
            />
        </>
    )
}

export default UsersPage