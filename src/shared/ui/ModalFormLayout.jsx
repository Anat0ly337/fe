import {Button, Form, Modal} from "antd";


const ModalFormLayout = ({
    title, form, onSubmit, open, onClose, children
}) => {
    return (
        <Modal
            open={open}
            title={title}
            onCancel={onClose}
            footer={[]}
            destroyOnClose={true}
        >
            <Form
                form={form}
                onFinish={(val) => {
                    onSubmit(val)
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
                    <Button htmlType={'submit'}>Создать</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalFormLayout