import CreatingPage from "../CreatingPage/CreatingPage";
import {Button, DatePicker, Form, Input, message, Switch} from "antd";
import {SelectRole} from "../../shared/ui/SelectRole";
import {useState} from "react";
import dayjs from "dayjs";
import {apiRequests} from "../../shared/api";

const rule = {
    required: true,
    message: 'Обязательное поле'
}

const CreateUser = () => {
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
                message.success('Пользователь успешно создан')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')

            })
    }

    return (
        <>
            <CreatingPage
                title={'Создание пользователя'}
            >
                <Form
                    onFinish={handleSubmit}
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 5,
                    }}
                    style={{width: '100%'}}
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
                    <Form.Item>
                        <Button htmlType={'submit'}>Создать</Button>
                    </Form.Item>
                </Form>

            </CreatingPage>
        </>
    )
}

export default CreateUser