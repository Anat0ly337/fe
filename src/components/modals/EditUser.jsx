import {EditOutlined} from "@ant-design/icons";
import {Button, DatePicker, Form, Input, message, Modal, Switch} from "antd";
import {useState} from "react";
import {apiRequests} from "../../shared/api";
import findUniqueKeys from "../../shared/utils/findUniqueKeys";
import {SelectRole} from "../../shared/ui/SelectRole";
import dayjs from "dayjs";


export const EditUser = ({userData, updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [isPremium, setPremium] = useState(false)

    const updateHandle = async (val) => {
        const oldData = {...userData}
        if (userData.userSubscription === null) {
            if (val.isPremium === true) {
                oldData.userSubscription = {
                    isPremium: false
                }
            }
        }
        const uniq = findUniqueKeys({
            ...oldData
        }, {
            ...val,
            userSubscription: {
                ...userData.userSubscription,
                isPremium: val.isPremium,
                expirationDate: dayjs(val.expirationDate).format('YYYY-MM-DD')
            },
            userPaymentHistory: userData.userPaymentHistory
        })
        if (Object.keys(uniq).length === 0) {
            return message.info('Вы не сделали никаких изменений')
        }

        if (uniq.userSubscription?.isPremium && !val.expirationDate) {
            return message.info('Укажите дату окончания подписки')
        }

        if (typeof uniq.accountBlocked === "boolean") {
            await apiRequests.user.updateStatus(userData.id, uniq.accountBlocked === true ? 'BLOCKED' : 'UNBLOCKED')
                .then((res) => {
                    updateRow(res.data)
                    message.success('Данные успешно изменены')
                    setActive(false)
                })
        }
        await apiRequests.user.update(userData.id, {
            userSubscription: {
                subscriptionPlan: val.isPremium ? 'PREMIUM' : 'FREE',
                expirationDate: dayjs(val.expirationDate).format('YYYY-MM-DD')
            },
            ...val
        })
            .then((res) => {
                updateRow(res.data)
                message.success('Данные успешно изменены')
                setActive(false)
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')

            })

    }

    return (
        <>
            <Button onClick={() => setActive(true)} icon={<EditOutlined />} />
            <Modal
                destroyOnClose={true}
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
                    <Form.Item label={'Роль'} name={'userRole'}>
                        <SelectRole />
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
                    <Form.Item initialValue={userData.userSubscription?.isPremium} label={'Премиум'} name={'isPremium'}>
                        <Switch onChange={setPremium} />
                    </Form.Item>
                    <Form.Item initialValue={userData.userSubscription?.expirationDate && dayjs(userData.userSubscription?.expirationDate)} name={'expirationDate'} label={'Срок истечения подписки'}>
                        <DatePicker  style={{width: '100%'}} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}