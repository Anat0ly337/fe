import {useState} from "react";
import findUniqueKeys from "../../shared/utils/findUniqueKeys";
import {apiRequests} from "../../shared/api";
import {Button, DatePicker, Form, Input, message, Modal, Select, Switch} from "antd";
import {EditOutlined} from "@ant-design/icons";
import ModalFormLayout from "../../shared/ui/ModalFormLayout";
import dayjs from "dayjs";
import {SelectRole} from "../../shared/ui/SelectRole";

const rule = {
    required: true,
    message: 'Обязательное поле'
}

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
                message.success('Пользователь успешно создан')
            })
            .catch((e) => {
                if (e.response.data.message === 'user or device id already exists') {
                    message.error('Пользователь с таким именем или устройством уже создан')
                } else {
                    message.error('Произошла ошибка')
                }
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
                <Form.Item rules={[rule]} label={'Почта'} name={'email'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} label={'ID приставки'} name={'deviceId'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} initialValue={'USER'} label={'Роль'} name={'userRole'}>
                    <SelectRole />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Пароль'} name={'password'}>
                    <Input />
                </Form.Item>
                <Form.Item initialValue={isPremium} label={'Премиум'} name={'isPremium'}>
                    <Switch onChange={setPremium} />
                </Form.Item>
                {
                    isPremium && (
                        <Form.Item name={'expirationDate'} label={'Срок истечения'}>
                            <DatePicker  style={{width: '100%'}} />
                        </Form.Item>
                    )
                }
            </ModalFormLayout>
        </>
    )
}