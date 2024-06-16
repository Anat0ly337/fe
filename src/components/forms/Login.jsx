import {Button, Form, Input, message} from "antd";
import {useForm} from "antd/es/form/Form";
import Link from "antd/es/typography/Link";
import {axiosInstance} from "../../shared/axiosInstance";
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom";
import {setAuth} from "../../store/main";
import {useDispatch} from "react-redux";

export const LoginForm = ({setReg}) => {
    const [form] = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSubmit = async (values) => {

        await axiosInstance.post('/api/v1/auth/authenticate', {
            ...values
        })
            .then((res) => {
                sessionStorage.setItem('accessToken', res.data.access_token)
                dispatch(setAuth(true))
                navigate('/users')
            })
            .catch((e) => {
                if (e.response.status === 400) {
                    message.error('Неправильный логин или пароль')
                } else {
                    message.error('Произошла ошибка')
                }
            })
    }

    return (
        <>
            <Form
                onFinish={handleSubmit}
                form={form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
            >
                <Form.Item name={'email'} label={'Почта'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'password'} label={'Пароль'}>
                    <Input />
                </Form.Item>
                <div style={{margin: '10px 0'}}>
                    <Link onClick={setReg} style={{margin: '0 0 0 200px'}}>Зарегистрироваться</Link>
                </div>
                <Form.Item style={{ margin: 0, float: 'right'}}>
                    <Button htmlType={'submit'} type={'primary'}>
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}