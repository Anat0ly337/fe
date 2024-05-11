import ModalFormLayout from "../../shared/ui/ModalFormLayout";
import {useState} from "react";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {apiRequests} from "../../shared/api";

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

const rule = {
    required: true,
    message: 'Обязательное поле'
}

export const CreateContract = ({updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [typeDuration, setTypeDuration] = useState(selectOptions[0])
    const blobToBase64 = async (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    const handleSubmit = async (val) => {

        const requestData = {
            ...val,
            contract_duration_measure: typeDuration.key,
            dateStartCampaign: dayjs(val.dateStartCampaign).format('YYYY-MM-DD'),
            advertisementData: []
        }
        let count = 0;
        for (let i = 0; i < val.pictures.fileList.length; i++) {
            await blobToBase64(val.pictures.fileList[i].originFileObj)
                .then((res) => {
                    console.log(res)
                    requestData.advertisementData.push({
                        orderNumber: ++count,
                        image: res.split(',').pop(),
                        mediaType: val.pictures.fileList[i].type
                    })
                })
        }

        await apiRequests.advertisement.create(requestData)
            .then(async (res) => {
                updateRow(res.data)
                message.success('Контракт успешно создан')
            })
            .catch((e) => {
                message.error('Произошла ошибка')
            })
    }

    return (
        <>
            <Button onClick={() => setActive(true)} style={{marginBottom: '25px'}} type={'primary'}>
                Создать контракт
            </Button>
            <ModalFormLayout
                onSubmit={handleSubmit}
                open={isActive}
                title={'Создание контракта'}
                onClose={() => setActive(false)}
            >
                <Form.Item rules={[rule]} name={'customerName'} label={'Имя заказчика'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} name={'description'} label={'Описание'}>
                    <TextArea />
                </Form.Item>
                <Form.Item rules={[rule]} initialValue={dayjs(new Date())} name={'dateStartCampaign'} label={'Дата начала действия'}>
                    <DatePicker />
                </Form.Item>
                <Form.Item rules={[rule]} name={'contract_duration'} label={'Срок контракта'}>
                    <Space>
                        <InputNumber />
                        <Select defaultValue={typeDuration} onChange={(value, option) => setTypeDuration(option)} style={{width: '130px'}} options={selectOptions} />
                    </Space>
                </Form.Item>
                <Form.Item rules={[rule]} name={'pictures'} label={'Изображение'}>
                    <Upload
                        listType={'picture'}
                        accept="image/*"
                        action='/'
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
            </ModalFormLayout>
        </>
    )
}