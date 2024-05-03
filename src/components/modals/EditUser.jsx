import {EditOutlined} from "@ant-design/icons";
import {Button, Form, Input, message, Modal, Switch} from "antd";
import {useState} from "react";
import {apiRequests} from "../../shared/api";
import findUniqueKeys from "../../shared/utils/findUniqueKeys";


export const EditUser = ({userData, updateRow}) => {
    const [isActive, setActive] = useState(false)

    const updateHandle = async (val) => {
        const uniq = findUniqueKeys(userData, val)
        console.log(uniq)
        if (typeof uniq.accountBlocked === "boolean") {
            await apiRequests.user.updateStatus(userData.id, uniq.accountBlocked === true ? 'BLOCKED' : 'UNBLOCKED')
                .then((res) => {
                    updateRow(res.data)
                    message.success('Данные успешно изменены')
                    setActive(false)
                })
        } else {
            await apiRequests.user.update(userData.id, {
                userSubscription: userData.userSubscription,
                ...val
            })
                .then((res) => {
                    updateRow(res.data)
                    message.success('Данные успешно изменены')
                    setActive(false)
                })
                .catch((err) => {
                    message.error('Произошла ошибка, пожалуйста повторите попытку позже')
                })
        }

    }

    return (
        <>
            <Button onClick={() => setActive(true)} icon={<EditOutlined />} />
            <Modal
                open={isActive}
                onCancel={() => setActive(false)}
                footer={[]}
                title={'Редактирование пользователя'}
            >
                <Form
                    onFinish={updateHandle}
                    style={{marginTop: '25px'}}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={userData}
                >
                    <Form.Item label={'Почта'} name={'email'}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'Дата регистрации'} name={'registeredDate'}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'Роль'} name={'userRole'}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'ID устройства'} name={'deviceId'}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'Пароль'} name={'password'}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'Заблокирован'} name={'accountBlocked'}>
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}