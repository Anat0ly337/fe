import { UnorderedListOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useState } from "react";


const columns = [
    {
        title: 'Номер',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Дата проведения',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
    },
    {
        title: 'Сумма',
        dataIndex: 'paymentAmount',
        key: 'paymentAmount',
    },
    {
        title: 'Валюта',
        dataIndex: 'paymentCurrency',
        key: 'paymentCurrency',
    },
    
]

const UserActivities = ({data}) => {
    const [isActive, setActive] = useState(false)

    return (
        <>
            <Button onClick={() => setActive(true)} icon={<UnorderedListOutlined />} />
            <Modal
                width={950}
                onCancel={() => setActive(false)}
                open={isActive}
                title='История платежей'
                footer={[]}
            >
                <Table 
                    dataSource={data}
                    columns={columns}
                />  
            </Modal>
        </>
    )

};

export default UserActivities