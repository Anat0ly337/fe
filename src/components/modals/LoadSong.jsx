import {CloudDownloadOutlined, LoadingOutlined} from "@ant-design/icons";
import {Button, Form, Input, InputNumber, message, Modal, Select, Spin, Upload} from "antd";
import { useState } from "react";
import {useSelector} from "react-redux";
import {apiRequests} from "../../shared/api";

const rule = { required: true, message: 'Поле не может быть пустым' }

const LoadSong = ({updateRow}) => {
    const [isActive, setActive] = useState(false)
    const [isRequestLoading, setRequestLoading] = useState(false)
    const [authors, setAuthorsList] = useState([])
    const [albums, setAlbumList] = useState([])

    const {mainSlice} = useSelector(state => state)

    function onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
    }

    const submitHandler = async (val) => {
        const formData = new FormData()
        for (let key in val) {
            if (typeof val[key] === "object") {
                formData.append(key, new Blob([val[key].file.originFileObj]))
            } else {
                formData.append(key, val[key])
            }
        }
        setRequestLoading(true)
        await apiRequests.media.create(formData)
            .then(async (res) => {
                setRequestLoading(false)
                window.location.reload()
            })
            .catch((e) => {
                message.error('Произошла ошибка')
            })
    }

    const showModal = () => {
        setAuthorsList([...mainSlice.authors].map(i => ({
            value: i.authorFullName,
            key: i.id
        })))
        setAlbumList([...mainSlice.albums].map(i => ({
            value: i.name,
            key: i.id
        })))
        setActive(true)
    }

    return (
      <>
        <Button onClick={showModal}  type="primary" icon={<CloudDownloadOutlined />}>Загрузить аудио</Button>
        <Modal
            destroyOnClose={true}
            open={isActive}
            footer={[]} 
            onCancel={() => setActive(false)} 
            title='Загрузка аудио'
        >
            <Form
                onFinish={submitHandler}
                style={{marginTop: '25px'}}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 25,
                }}
            >
                <Form.Item rules={[rule]} label={'Название'} name={'name'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Год'} name={'yearIssue'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Жанр'} name={'genre'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Альбом'} name={'album'}>
                    <Select options={albums} />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Автор'} name={'author'}>
                    <Select options={authors} />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Трек'} name={'song'}>
                    <Upload
                        accept=".mp3,audio/*, image/*"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item rules={[rule]} label={'Текст'} name={'textFile'}>
                    <Upload
                        accept=".mp3,audio/*, .txt"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item rules={[rule]} label={'Изображение'} name={'img'}>
                    <Upload
                        accept=".mp3,audio/*, image/*"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item rules={[rule]} label={'Ноты'} name={'notes'}>
                    <Upload
                        accept=".mp3,audio/*, image/*"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button icon={isRequestLoading && <Spin size={'small'} />} disabled={isRequestLoading} htmlType={'submit'}>Добавить</Button>
                </Form.Item>
            </Form>

        </Modal>
      </>
    )
};

export default LoadSong;
