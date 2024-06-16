import {Button, Form, Input, message, Modal, Select, Upload} from "antd";
import {UserAddOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {useDispatch, useSelector} from "react-redux";
import {setAlbums, setAuthors} from "../../store/main";
import CreatingPage from "../../pages/CreatingPage/CreatingPage";


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
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    useEffect(() => {
        setAuthorList(
            [...mainSlice.authors].map(i => ({
                key: i.id,
                value: i.authorFullName
            }))
        )
    }, [mainSlice.authors]);

    return (
        <>
            <CreatingPage
                title={'Добавление альбома'}
            >
                <Form
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 5,
                    }}
                    style={{width: '100%'}}
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
                    <Form.Item
                        wrapperCol={{ span: 24 }}
                        style={{ textAlign: 'center'}}
                    >
                        <Button style={{width: '15%'}} htmlType={'submit'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </CreatingPage>
        </>
    )
}