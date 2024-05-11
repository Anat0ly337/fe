import {Button, Form, Input, message, Modal, Select, Upload} from "antd";
import {UserAddOutlined} from "@ant-design/icons";
import {useState} from "react";
import {apiRequests} from "../../shared/api";
import {useDispatch, useSelector} from "react-redux";
import {setAlbums, setAuthors} from "../../store/main";


export const LoadAlbum = () => {
    const [isActive, setActive] = useState(false)
    const [authorsList, setAuthorList] = useState([])
    const {mainSlice} = useSelector(state => state)
    const dispatch = useDispatch()

    const submitHandler = async (val) => {
        const formData = new FormData()
        for (let key in val) {
            if (typeof val[key] === "object") {
                formData.append(key, new Blob([val[key].file.originFileObj]))
            } else {
                formData.append(key, val[key])
            }
        }

        await apiRequests.albums.create(formData)
            .then((res) => {
                dispatch(setAlbums([...mainSlice.albums, res.data]))
                message.success('Альбом успешно создан')
                setActive(false)
            })
            .catch((e) => {
                if (e.response.data.message === 'Album already exists') {
                    message.error('Данный автор уже существует')
                } else {
                    message.error('Произошла ошибка')
                }
            })
    }

    const showModal = () => {
        setAuthorList(
            [...mainSlice.authors].map(i => ({
                key: i.id,
                value: i.authorFullName
            }))
        )
        setActive(true)
    }

    return (
        <>
            <Button onClick={showModal} type={'primary'} icon={<UserAddOutlined />}>Добавить альбом</Button>
            <Modal
                title={'Добавление альбома'}
                footer={[]}
                onCancel={() => setActive(false)}
                open={isActive}
            >
                <Form
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    style={{marginTop: '25px'}}
                    onFinish={submitHandler}
                >
                    <Form.Item rules={[{required: true, message: 'Обязательное поле'}]} label={'Название'} name={'name'}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'Обязательное поле'}]} label={'Автор'} name={'author'}>
                        <Select options={authorsList} />
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'Обязательное поле'}]} label={'Жанр'} name={'genre'}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'Обязательное поле'}]} label={'Изображение'} name={'albumPicture'}>
                        <Upload
                            accept="image/*"
                            action='/'
                        >
                            <Button>Загрузить</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}