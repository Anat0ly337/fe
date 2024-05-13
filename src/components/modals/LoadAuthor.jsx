import {Button, Form, Input, message, Modal} from "antd";
import {UserAddOutlined} from "@ant-design/icons";
import {useState} from "react";
import {apiRequests} from "../../shared/api";
import {useDispatch, useSelector} from "react-redux";
import {setAuthors} from "../../store/main";


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
            <Button onClick={() => setActive(true)} type={'primary'} icon={<UserAddOutlined />}>Добавить автора</Button>
            <Modal
                title={'Добавление автора'}
                footer={[]}
                onCancel={() => setActive(false)}
                open={isActive}
            >
                <Form style={{marginTop: '25px'}} onFinish={submitHandler}>
                    <Form.Item rules={[{required: true, message: 'Обязательное поле'}]} label={'ФИО'} name={'authorFullName'}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

