import { EditOutlined } from "@ant-design/icons";
import {Button, Form, Input, InputNumber, message, Modal, Select, Spin, Switch, Upload} from "antd";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {axiosInstance} from "../../shared/axiosInstance";
import {useSelector} from "react-redux";
import CreatingPage from "../../pages/CreatingPage/CreatingPage";
import {useLocation, useParams} from "react-router-dom";
import findUniqueKeys from "../../shared/utils/findUniqueKeys";
import {SelectAuthors} from "../../shared/ui/SelectAuthors";
import {SelectAlbum} from "../../shared/ui/SelectAlbum";
import { SelectHolders } from "../../shared/ui/SelectHolders";
import {FileUpload} from "../../shared/ui/FileUpload";


const EditSong = ({}) => {
    const [data, setData] = useState({})
    const [isActive, setActive] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [albumList, setAlbumList] = useState([])
    const [songFile, setSongFile] = useState(null)
    const {id} = useParams()
    const {mainSlice} = useSelector(state => state)
    const {state} = useLocation()
    const handleSubmit = async (val) => {
        setLoading(true)
        const formData = new FormData()
        const submitData = {
            ...data,
            ...val
        }

        const iterateData = Object.keys(submitData).map((i) => {
            if (i !== undefined) {
                return i
            }
        })
        for (let key in submitData) {
            if (submitData[key]) {
                if (typeof submitData[key] === "object") {
                    switch (key) {
                        case 'author':
                            formData.append('authors', Array.from(new Set(val[key])))
                            break;
                        case 'tags':
                            formData.append('tags', Array.from(new Set(val[key].split(','))))
                            break;
                        case 'authorsNew':
                            break;
                        default:
                            formData.append(key, new Blob([submitData[key].fileList[0].originFileObj]))
                            formData.append(`${key}ContentType`, submitData[key].file.originFileObj.type)
                            break;
                    }
                } else {
                    // Deleted unused items
                    const deletedItem = key.includes('Uri') || key.includes('blobUrl')
                    if (!deletedItem) {
                        formData.append(key, submitData[key])
                    }
                }
            }
        }
        if (songFile) {
            formData.append('song', songFile[0])
            formData.append('songContentType', songFile[0].type)
            formData.append('fileName', songFile[0].name)
        }
        await apiRequests.media.update(data.id, formData)
            .then((res) => {
                const updatedData = {};
                formData.forEach(function(value, key){
                    updatedData[key] = value;
                })
                // ???
                setData(prev => ({
                    ...prev,
                    ...updatedData
                }))
                message.success('Аудио успешно изменено')
                setLoading(false)
                setActive(false)
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
                setLoading(false)
            })

    }

    const showModal = () => {
        setLoading(true)
        const currentItem = mainSlice.songs.find(i => i.id == id)
        if (state) {
            setData({
                ...state.data,
            })
        }

        setAlbumList(
            mainSlice.albums.map(i => ({
                key: i.id,
                value: i.name
            }))
        )
        setLoading(false)
    }
    useEffect(() => {
        showModal()
    }, [])
    return (
        <>
        {
            isLoading ? <Spin /> : (
                <CreatingPage
                    title={'Редактирование аудио'}
                >
                    <Form
                        style={{ maxWidth: 750, margin: '0 auto' }}
                        initialValues={data}
                        onFinish={handleSubmit}
                    >
                        <Form.Item label='Название' name='name'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Автор' name='author'>
                            <SelectAuthors />
                        </Form.Item>
                        <Form.Item label='Теги' name='tags'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Жанр' name='genre'>
                            <Input  />
                        </Form.Item>
                        <Form.Item label='Альбом' name='album'>
                            <SelectAlbum />
                        </Form.Item>
                        <Form.Item label='Правообладатель' name='holder'>
                            <SelectHolders />
                        </Form.Item>
                        <Form.Item label='Ненормативная лексика' name='hasProfanity'>
                            <Switch />
                        </Form.Item>
                        <Form.Item label='Изображение' name='img'>
                            <Upload
                                accept=".jpg, image/jpeg, .jpeg, image/jpeg"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Ноты' name='notes'>
                            <Upload
                                accept="audio/midi"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Текст' name='textFile'>
                            <Upload
                                accept="text/plain"
                                action='/'
                            >
                                <Button>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label='Аудио' name='song'>
                            <FileUpload setSongFile={setSongFile} songFile={songFile} />
                        </Form.Item>

                        <Form.Item>
                            <Button loading={isLoading} htmlType="submit">Сохранить</Button>
                        </Form.Item>
                    </Form>
                </CreatingPage>
            )
        }
                
        </>
    )
};

export default EditSong;
