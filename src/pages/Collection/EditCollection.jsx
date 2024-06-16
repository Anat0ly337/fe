import { EditOutlined } from "@ant-design/icons";
import {Button, Form, Input, InputNumber, message, Modal, Select, Spin, Switch, Upload} from "antd";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {axiosInstance} from "../../shared/axiosInstance";
import {useSelector} from "react-redux";
import CreatingPage from "../../pages/CreatingPage/CreatingPage";
import { useParams } from "react-router-dom";


const EditSong = () => {
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const {id} = useParams()
    const {mainSlice} = useSelector(state => state)

    const handleSubmit = async (val) => {
        setLoading(true)
        const formData = new FormData()
        const submitData = {
            ...data,
            ...val
        }

        for (let key in submitData) {
            if (submitData[key]) {
                if (key === "collectionImageAwsUuid") {
                    if (typeof submitData[key] === 'object') {
                        console.log(submitData[key])
                        formData.append(key, new Blob([submitData[key].fileList[0].originFileObj]))
                        formData.append(`${key}ContentType`, submitData[key].file.originFileObj.type)
                    }
                } else {
                    formData.append(key, submitData[key])
                }
            }
        }

        await apiRequests.collection.update(data.id, formData)
            .then((res) => {
                message.success('Подборка успешно изменена')
                setLoading(false)
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
                setLoading(false)
            })
    }

    const showModal = () => {
        setLoading(true)
        const currentItem = mainSlice.collection.find(i => i.id == id)
        if (currentItem) {
            setData({
                id: currentItem.id,
                name: currentItem.name,
                description: currentItem.description,
                collectionImageAwsUuid: currentItem.collectionImageAwsUuid
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        showModal()
    }, [])
    return (
        <>
            {
                isLoading ? <Spin /> : (
                    <CreatingPage
                        title={'Редактирование подборки'}
                    >
                        <Form
                            style={{ maxWidth: 700, margin: '0 auto' }}
                            initialValues={data}
                            onFinish={handleSubmit}
                        >
                            <Form.Item label='Название' name='name'>
                                <Input rows={5} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label='Описание' name='description'>
                                <Input />
                            </Form.Item>
                            <Form.Item label='Изображение' name='collectionImageAwsUuid'>
                                <Upload
                                    accept=".jpg, image/jpeg, .jpeg, image/jpeg, .png"
                                    action='/'
                                >
                                    <Button>Загрузить</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button loading={isLoading} htmlType="submit">Сохранить</Button>
                            </Form.Item>
                        </Form>
                    </CreatingPage>
                )
            }

        </>
    )
};

export default EditSong;