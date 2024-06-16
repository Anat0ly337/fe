import { EditOutlined } from "@ant-design/icons";
import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Spin, Switch, Upload} from "antd";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {axiosInstance} from "../../shared/axiosInstance";
import {useSelector} from "react-redux";
import CreatingPage from "../../pages/CreatingPage/CreatingPage";
import {useLocation, useParams} from "react-router-dom";
import findUniqueKeys from "../../shared/utils/findUniqueKeys";
import dayjs from "dayjs";
import {SelectRole} from "../../shared/ui/SelectRole";


const EditUserPage = () => {
    const {state} = useLocation()
    const {userData} = state

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
                    message.success('Данные успешно изменены')
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
                message.success('Данные успешно изменены')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')

            })

    }

    return (
        <>
            <CreatingPage
                title={'Редактирование пользователя'}
            >
                <Form
                    style={{ maxWidth: 700, margin: '0 auto' }}
                    initialValues={userData}
                    onFinish={updateHandle}
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
                        <Switch  />
                    </Form.Item>
                    <Form.Item initialValue={userData.userSubscription?.expirationDate && dayjs(userData.userSubscription?.expirationDate)} name={'expirationDate'} label={'Срок истечения подписки'}>
                        <DatePicker  style={{width: '100%'}} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Сохранить</Button>
                    </Form.Item>
                </Form>
            </CreatingPage>

        </>
    )
};

export default EditUserPage;