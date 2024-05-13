import { EditOutlined } from "@ant-design/icons";
import {Button, Form, Input, InputNumber, message, Modal, Select, Upload} from "antd";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {axiosInstance} from "../../shared/axiosInstance";
import {useSelector} from "react-redux";


const EditSong = ({data, updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [authorsList, setAuthorList] = useState([])
    const [albumList, setAlbumList] = useState([])
    const {mainSlice} = useSelector(state => state)

    const handleSubmit = async (val) => {
        setLoading(true)
        const formData = new FormData()
        const submitData = {
            ...data,
            ...val
        }

        console.log(submitData)
        for (let key in submitData) {
            if (submitData[key]) {
                if (typeof submitData[key] === "object") {
                    formData.append(key, new Blob([submitData[key].fileList[0].originFileObj]))
                    formData.append(`${key}ContentType`, submitData[key].file.originFileObj.type)
                } else {
                    // Deleted unused items
                    const deletedItem = key.includes('Uri') || key.includes('blobUrl')
                    if (!deletedItem) {
                        formData.append(key, submitData[key])
                    }
                }
            }
        }

        await apiRequests.media.update(data.id, formData)
            .then((res) => {
                updateRow({
                    ...data,
                    ...val
                })
                message.success('Аудио успешно изменено')
                setLoading(false)
                setActive(false)
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
                setLoading(false)
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
                                accept=".jpg, image/jpeg, .jpeg, image/jpeg"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Ноты' name='notes'>
                            <Upload
                                accept="audio/midi"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Текст' name='textFile'>
                            <Upload
                                accept="text/plain"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Аудио' name='song'>
                            <Upload
                                accept="audio/mpeg, .mp4, .m4a"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={isLoading} htmlType="submit">Сохранить</Button>
                        </Form.Item>
                    </Form>
            </Modal>
        </>
    )
};

export default EditSong;
