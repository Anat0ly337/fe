import {Button, Form, Input, message} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {apiRequests} from "../../shared/api";


export const SearchUsers = ({updateData}) => {

    const searchHandler = async (val) => {
        try {
            if (val.email) {
                await apiRequests.users.getByEmail(val.email)
                    .then((res) => {
                        updateData(res.data)
                    })
            } else if (val.id_device) {
                await apiRequests.users.getByIdDevice(val.id_device)
                    .then((res) => {
                        updateData([res.data])
                    })
            } else {
                await apiRequests.users.get()
                    .then((res) => {
                        updateData(res.data)
                    })
            }
        } catch (e) {
            if (e.response.data.message === 'User Not Found') {
                message.info('Пользователь не найден')
            } else {
                message.error(e.response.data.message || 'Произошла ошибка')
            }
        }

    }

    return (
        <Form onFinish={searchHandler}>
            <Form.Item name={'email'}>
                <Input placeholder={'E-mail'} />
            </Form.Item>
            <Form.Item name={'id_device'}>
                <Input placeholder={'ID приставки'} />
            </Form.Item>
            <Form.Item>
                <Button htmlType={'submit'} icon={<SearchOutlined />}>Найти</Button>
            </Form.Item>
        </Form>
    )
}