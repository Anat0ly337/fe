import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiRequests} from "../../shared/api";
import {Button, Form, Input, message, Select, Spin, Switch, Upload} from "antd";
import CreatingPage from "../CreatingPage/CreatingPage";
import {setCollection} from "../../store/main";

const rule = { required: true, message: 'Поле не может быть пустым' }

const CreateCollection = () => {
    const [isRequestLoading, setRequestLoading] = useState(false)
    const {mainSlice} = useSelector(state => state)
    const dispatch = useDispatch()

    const submitHandler = async (val) => {
        const formData = new FormData()
        for (let key in val) {
            if (typeof val[key] === "object") {
                formData.append(key, new Blob([val[key].file.originFileObj]))
                formData.append(`imgContentType`, val[key].file.originFileObj.type)
            } else {
                formData.append(key, val[key])
            }
        }
        setRequestLoading(true)
        await apiRequests.collection.create(formData)
            .then(async (res) => {
                dispatch(setCollection([...mainSlice.collection, res.data]))
                setRequestLoading(false)
                message.success('Подборка успешно создана')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    return (
        <>
            <CreatingPage
                title='Создание подборки'
            >
                <Form
                    onFinish={submitHandler}
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 5,
                    }}
                    style={{width: '100%'}}
                >
                    <Form.Item rules={[rule]} label={'Название'} name={'name'}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[rule]} label={'Описание'} name={'description'}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[rule]} label={'Изображение'} name={'collectionImage'}>
                        <Upload
                            accept=".jpg, image/jpeg, .jpeg, image/jpeg, .png"
                            action='/'
                        >
                            <Button>Загрузить</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 24 }}
                        style={{ textAlign: 'center'}}
                    >
                        <Button icon={isRequestLoading && <Spin size={'small'} />} style={{width: '15%'}} disabled={isRequestLoading} htmlType={'submit'}>Добавить</Button>
                    </Form.Item>
                </Form>

            </CreatingPage>
        </>
    )
}

export default CreateCollection