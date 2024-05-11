import ModalFormLayout from "../../shared/ui/ModalFormLayout";
import {useState} from "react";
import {Button, Form, Input, InputNumber, message, Select, Space, Switch} from "antd";
import {apiRequests} from "../../shared/api";

const rule = {
    required: true,
    message: 'Обязательное поле'
}

const selectOptions = [
    {
        value: 'Дни',
        key: 'DAY'
    },
    {
        value: 'Месяцы',
        key: 'MONTH'
    },
    {
        value: 'Год',
        key: 'YEAR'
    },
]

export const CreatePromocode = ({updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [typeDuration, setTypeDuration] = useState(selectOptions[0])

    const handleSubmit = async (values) => {
        await apiRequests.promocode.create({
            ...values,
            activated: null,
            measure: typeDuration.key,
        })
            .then((res) => {
                updateRow(res.data)
                message.success('Промокод успешно создан')
            })
            .catch((e) => message.error('Произошла ошибка'))
    }

    return (
        <>
            <Button type={'primary'} onClick={() => setActive(true)} style={{marginBottom: '20px'}}>Создать промокод</Button>
            <ModalFormLayout
                onSubmit={handleSubmit}
                title={'Создание промокода'}
                open={isActive}
                onClose={() => setActive(false)}
            >
                <Form.Item rules={[rule]} label={'Номер промокода'} name={'promocodeNumber'}>
                    <Input />
                </Form.Item>
                <Form.Item required label={'Срок действия'} name={'period'}>
                    <Space>
                        <InputNumber />
                        <Select defaultValue={typeDuration} onChange={(value, option) => setTypeDuration(option)} style={{width: '130px'}} options={selectOptions} />
                    </Space>
                </Form.Item >
            </ModalFormLayout>
        </>
    )
}