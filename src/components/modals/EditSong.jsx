import { EditOutlined } from "@ant-design/icons";
import {Button, Form, Input, InputNumber, message, Modal, Select, Upload} from "antd";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {axiosInstance} from "../../shared/axiosInstance";
import {useSelector} from "react-redux";


const EditSong = ({data, updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [authorsList, setAuthorList] = useState([])
    const [albumList, setAlbumList] = useState([])
    const {mainSlice} = useSelector(state => state)

    const handleSubmit = async (val) => {
        const formData = new FormData()
        const submitData = {
            ...data,
            ...val
        }

        console.log(submitData)
        for (let key in submitData) {
            if (submitData[key]) {
                if (typeof submitData[key] === "object") {
                    formData.delete(key)
                    formData.append(key, new Blob([submitData[key].fileList[0].originFileObj]))
                    formData.append(`${key}ContentType`, submitData[key].file.originFileObj.type)
                }
                formData.append(key, submitData[key])
            }
        }

        await apiRequests.media.update(data.id, formData)
            .then((res) => {
                updateRow({
                    ...data,
                    ...val
                })
                message.success('Аудио успешно изменено')
                setActive(false)
            })
            .catch(() => {
                message.error('Произошла ошибка')
            })

    }

    const showModal = () => {
        setAuthorList(
            [...mainSlice.authors].map(i => ({
                key: i.id,
                value: i.authorFullName
            }))
        )
        setAlbumList(
            [...mainSlice.albums].map(i => ({
                key: i.id,
                value: i.name
            }))
        )
        setActive(true)
    }

    return (
        <>
            <Button onClick={showModal} icon={<EditOutlined />}></Button>
                <Modal 
                    onCancel={() => setActive(false)}
                    open={isActive}
                    footer={[]}
                    title={'Редактирование аудио'}
                >
                    <Form 
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        initialValues={data}
                        onFinish={handleSubmit}
                    >
                        <Form.Item label='Название' name='name'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Автор' name='author'>
                            <Select options={authorsList} />
                        </Form.Item>
                        <Form.Item label='Жанр' name='genre'>
                            <Input  />
                        </Form.Item>
                        <Form.Item label='Альбом' name='album'>
                            <Select options={albumList} />
                        </Form.Item>
                        <Form.Item label='Год' name='yearIssue'>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label='Изображение' name='img'>
                            <Upload
                                accept="image/*"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Ноты' name='notes'>
                            <Upload
                                accept="text/*, image/*"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Текст' name='textFile'>
                            <Upload
                                accept="text/*, image/*"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Аудио' name='song'>
                            <Upload
                                accept="audio/*"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit">Сохранить</Button>
                        </Form.Item>
                    </Form>
            </Modal>
        </>
    )
};

export default EditSong;
