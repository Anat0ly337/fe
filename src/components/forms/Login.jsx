import {Button, Form, Input} from "antd";
import {useForm} from "antd/es/form/Form";
import Link from "antd/es/typography/Link";
import {axiosInstance} from "../../shared/axiosInstance";
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom";

export const LoginForm = ({setReg}) => {
    const [form] = useForm()
    const navigate = useNavigate()
    const handleSubmit = async (values) => {
        await axiosInstance.post('/v1/auth/authenticate', {
            ...values
        })
            .then((res) => {
                Cookies.set('accessToken', res.data.access_token)
                navigate('/users')
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