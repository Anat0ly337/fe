import CreatingPage from "../CreatingPage/CreatingPage";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {Button, Form, Input, message, Select, Spin, Switch, Upload} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setHolders} from "../../store/main";

const rule = { required: true, message: 'Поле не может быть пустым' }

const CreateHolder = () => {
    const [isRequestLoading, setRequestLoading] = useState(false)
    const dispatch = useDispatch()
    const {mainSlice} = useSelector(state => state)

    function onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    }

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
        await apiRequests.holders.create(formData)
            .then(async (res) => {
                setRequestLoading(false)
                dispatch(setHolders([...mainSlice.holders, res.data]))
                message.success('Правообладатель успешно создан')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    return (
        <>
            <CreatingPage
                title='Создание правообладателя'
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
                    <Form.Item rules={[rule]} label={'ФИО'} name={'holderFullName'}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[rule]} label={'Почта'} name={'holderEmail'}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[rule]} label={'Изображение'} name={'collectionImage'}>
                        <Upload
                            accept=".jpg, image/jpeg, .jpeg, image/jpeg"
                            action='/'
                            onChange={onChange}
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

export default CreateHolder