import {Button, Form, Modal} from "antd";
import {useState} from "react";


const ModalFormLayout = ({
    title, form, onSubmit, open, onClose, children
}) => {
    const [isLoading, setLoading] = useState(false)

    return (
        <Modal
            open={open}
            title={title}
            onCancel={onClose}
            footer={[]}
            destroyOnClose={true}
        >
            <Form
                disabled={isLoading}
                form={form}
                onFinish={async (val) => {
                    setLoading(true)
                    await onSubmit(val)
                    setLoading(false)
                    onClose()
                }}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 23,
                }}
                style={{marginTop: '25px'}}
            >
                {
                    children
                }
                <Form.Item>
                    <Button disabled={isLoading} htmlType={'submit'}>Создать</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalFormLayout