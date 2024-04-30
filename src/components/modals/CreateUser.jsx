import {useState} from "react";
import findUniqueKeys from "../../shared/utils/findUniqueKeys";
import {apiRequests} from "../../shared/api";
import {Button, DatePicker, Form, Input, message, Modal, Select, Switch} from "antd";
import {EditOutlined} from "@ant-design/icons";
import ModalFormLayout from "../../shared/ui/ModalFormLayout";
import dayjs from "dayjs";


const roles = [
    {
        value: 'USER',
        key: 'USER'
    },
    {
        value: 'MODERATOR',
        key: 'MODERATOR'
    },
    {
        value: 'ADMIN',
        key: 'ADMIN'
    }
]

export const CreateUser = ({updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [isPremium, setPremium] = useState(false)

    const handleSubmit = async (val) => {

        const userData = {
            ...val,
            userSubscription: null
        }
        if (val.isPremium) {
            userData['userSubscription'] = {
                expirationDate: dayjs(val.expirationDate).format('YYYY-MM-DD'),
                subscriptionPlan: 'PREMIUM'
            }
        }
        await apiRequests.user.create({
            userData: {...userData}
        })
            .then((res) => {
                updateRow(res.data)
            })
            .catch((e) => {
                message.error('Произошла ошибка')
            })
    }

    return (
        <>
            <Button type={'primary'} style={{marginBottom: '20px'}} onClick={() => setActive(true)}>Создать пользователя</Button>
            <ModalFormLayout
                open={isActive}
                onClose={() => setActive(false)}
                footer={[]}
                onSubmit={handleSubmit}
                title={'Создание пользователя'}
            >
                <Form.Item label={'Почта'} name={'email'}>
                    <Input />
                </Form.Item>
                <Form.Item label={'ID приставки'} name={'deviceId'}>
                    <Input />
                </Form.Item>
                <Form.Item label={'Роль'} initialValue={roles[0].value} name={'userRole'}>
                    <Select options={roles} />
                </Form.Item>
                <Form.Item label={'Пароль'} name={'password'}>
                    <Input />
                </Form.Item>
                <Form.Item initialValue={isPremium} label={'Премиум'} name={'isPremium'}>
                    <Switch onChange={setPremium} />
                </Form.Item>
                {
                    isPremium && (
                        <Form.Item name={'expirationDate'} label={'Годен до'}>
                            <DatePicker  style={{width: '100%'}} />
                        </Form.Item>
                    )
                }
            </ModalFormLayout>
        </>
    )
}