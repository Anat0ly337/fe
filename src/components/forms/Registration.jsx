import {Button, Form, Input} from "antd";
import {useForm} from "antd/es/form/Form";
import Link from "antd/es/typography/Link";
import {axiosInstance} from "../../shared/axiosInstance";


export const RegistrationForm = ({setReg}) => {
    const [form] = useForm()

    const handleSubmit = async (values) => {
        await axiosInstance.post('/v1/auth/register', {
            ...values
        })
            .then((res) => setReg)
    }

    return (
        <>
            <Form
                form={form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 23,
                }}
                onFinish={handleSubmit}
            >
                <Form.Item name={'email'} label={'Почта'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'password'} label={'Пароль'}>
                    <Input />
                </Form.Item>
                <div style={{margin: '10px 0'}}>
                    <Link onClick={setReg} style={{margin: '0 0 0 200px'}}>Войти</Link>
                </div>
                <Form.Item style={{ margin: 0, float: 'right'}}>
                    <Button htmlType={'submit'} type={'primary'}>
                        Зарегистрироваться
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}