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
import {parsePage} from "../../shared/utils/parsePage";

const UsersPage = () => {
    const [users, setUsers] = useState([])
    const [tablePagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 8,
            total: 250
        }
    })

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
            render: (_, record) => (
                <Tag
                    color={!record?.accountBlocked ? 'green' : 'red'}
                >
                    {!record?.accountBlocked ? 'Разблокирован' : 'Заблокирован'}
                </Tag>
            )
        },
        {
            title: 'Роль',
            dataIndex: 'userRole',
            key: 'userRole',
            render: (_, record) => (
                <Tag
                    color={record?.userRole === 'USER' ? 'green' : record?.userRole === 'ADMIN' ? 'red' : 'blue'}
                >
                    {record?.userRole}
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
            render: (_, record) => (
                record?.userSubscription ?
                    <Tag
                        color={'gold'}
                    >
                        {record?.userSubscription.subscriptionPlan}
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
                    <UserActivities data={record?.userPaymentHistory} />
                </Space>
            ),
        },

    ]

    useEffect(() => {
        apiRequests.users.get()
            .then((res) => {
                setUsers(res.data.users)
                setPagination({
                    pagination: {
                        ...tablePagination,
                        total: res.data.count
                    }

                })
            })
    }, []);

    const handlePagination = (params) => {
        const page = parsePage(params.current)
        apiRequests.users.get(10, page)
            .then((res) => {
                setPagination({
                    pagination: params
                })
                setUsers(res.data.users)
            })
    }


    return (
        <>
            <Collapse ghost>
                <Panel key={1} header={'Фильтры'}>
                    <SearchUsers updateData={setUsers} />
                </Panel>
            </Collapse>
            <CreateUser updateRow={(i) => setUsers(prev => [...prev, i])} />

            <Table
                pagination={tablePagination.pagination}
                dataSource={users}
                onChange={handlePagination}
                columns={columns}
            />
        </>
    )
}

export default UsersPage