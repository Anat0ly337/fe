import {Button, Form, Input, message, Modal} from "antd";
import {UserAddOutlined} from "@ant-design/icons";
import {useState} from "react";
import {apiRequests} from "../../shared/api";
import {useDispatch, useSelector} from "react-redux";
import {setAuthors} from "../../store/main";
import CreatingPage from "../../pages/CreatingPage/CreatingPage";


export const LoadAuthor = () => {
    const [isActive, setActive] = useState(false)
    const {mainSlice} = useSelector(state => state)
    const dispatch = useDispatch()

    const submitHandler = async (val) => {
        await apiRequests.authors.create(val)
            .then((res) => {
                dispatch(setAuthors([...mainSlice.authors, res.data]))
                message.success('Автор успешно создан')
                setActive(false)
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    return (
        <>
            <CreatingPage
                title={'Добавление автора'}
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
                    <Form.Item rules={[{required: true, message: 'Обязательное поле'}]} label={'ФИО'} name={'authorFullName'}>
                        <Input />
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

