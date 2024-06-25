import {Button, Checkbox, Form, Input, InputNumber, message, Modal, Select, Spin, Switch, Upload} from "antd";
import {CloudDownloadOutlined, LoadingOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {apiRequests} from "../../shared/api";
import CreatingPage from "../../pages/CreatingPage/CreatingPage";
import {SelectAuthors} from "../../shared/ui/SelectAuthors";
import {useNavigate} from "react-router-dom";
import {SelectAlbum} from "../../shared/ui/SelectAlbum";
import {FileUpload} from "../../shared/ui/FileUpload";
import {SelectHolders} from "../../shared/ui/SelectHolders";

const rule = { required: true, message: 'Поле не может быть пустым' }

const LoadSong = ({updateRow}) => {
    const [isRequestLoading, setRequestLoading] = useState(false)
    const [albums, setAlbumList] = useState([])
    const [songFile, setSongFile] = useState()
    const [holders, setHoldersList] = useState([])
    const {mainSlice} = useSelector(state => state)
    const navigate = useNavigate()
    function onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
    }

    const submitHandler = async (val) => {
        if (!songFile) {
            return message.error('Пожалуйста выберите трек')
        }
        const formData = new FormData()
        for (let key in val) {
            if (typeof val[key] === "object") {
                if (key === 'authors') {
                    formData.append('authors', Array.from(new Set(val[key])))
                } else {
                    formData.append(key, new Blob([val[key].file.originFileObj]))
                    formData.append(`${key}ContentType`, val[key].file.originFileObj.type)
                }

            } else {
                if (key === 'tags') {
                    formData.append(key, Array.from(new Set(val[key].split(','))))

                } else {
                    formData.append(key, val[key])
                }
            }
        }
        formData.append('song', new Blob([songFile[0]]))
        formData.append('songContentType', songFile[0].type)
        formData.append('fileName', songFile[0].name)

        setRequestLoading(true)
        await apiRequests.media.create(formData)
            .then(async (res) => {
                setRequestLoading(false)
                message.success('Трек успешно создан')
                navigate('/songs')
            })
            .catch((e) => {
                setRequestLoading(false)
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    useEffect(() => {
        setAlbumList(mainSlice.albums.map(i => ({
            value: i.name,
            key: i.id
        })))
        setHoldersList(mainSlice.holders.map(i => ({
            value: i.holderFullName,
            key: i.id
        })))
    }, [mainSlice.authors, mainSlice.albums, mainSlice.holders])

    return (
      <>
        <CreatingPage
            title='Загрузка аудио'
        >
            <Form
                onFinish={submitHandler}
                labelCol={{
                    span: 10,
                }}
                wrapperCol={{
                    span: 5,
                }}
                style={{width: '100%'}}
            >
                <Form.Item rules={[rule]} label={'Название'} name={'name'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Жанр'} name={'genre'}>
                    <Input />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Теги'} name={'tags'}>
                    <Input placeholder={'Введите теги через запятую'} />
                </Form.Item>
                <Form.Item label={'Альбом'} name={'album'}>
                    <SelectAlbum />
                </Form.Item>
                <Form.Item rules={[rule]}  label={'Автор'} name={'authors'}>
                    <SelectAuthors />
                </Form.Item>
                <Form.Item label={'Правообладатель'} name={'holder'}>
                    <SelectHolders />
                </Form.Item>
                <Form.Item initialValue={false} label={'Ненормативная лексика'} name={'hasProfanity'}>
                    <Switch />
                </Form.Item>
                <Form.Item  label={'Трек'}>
                    <FileUpload setSongFile={setSongFile} songFile={songFile} />
                </Form.Item>
                <Form.Item rules={[rule]} label={'Текст'} name={'txt'}>
                    <Upload
                        accept="text/plain"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item rules={[rule]} label={'Изображение'} name={'img'}>
                    <Upload
                        accept=".jpg, image/jpeg, .jpeg, image/jpeg"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item rules={[rule]} label={'Ноты'} name={'notes'}>
                    <Upload
                        accept="audio/midi"
                        action='/'
                        onChange={onChange}
                    >
                        <Button>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    style={{ textAlign: 'center'}}
                >
                    <Button icon={isRequestLoading && <Spin size={'small'} />} style={{width: '15%'}} disabled={isRequestLoading} htmlType={'submit'}>Добавить</Button>
                </Form.Item>
            </Form>

        </CreatingPage>
      </>
    )
};

export default LoadSong;
