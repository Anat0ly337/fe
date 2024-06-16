import CreatingPage from "../CreatingPage/CreatingPage";
import {useEffect, useState} from "react";
import {apiRequests} from "../../shared/api";
import {Button, Form, Input, message, Select, Spin, Switch, Upload} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setHolders} from "../../store/main";
import {useParams} from "react-router-dom";

const rule = { required: true, message: 'Поле не может быть пустым' }

const EditHolder = () => {
    const [data, setData] = useState()
    const [isRequestLoading, setRequestLoading] = useState(false)
    const dispatch = useDispatch()
    const {mainSlice} = useSelector(state => state)
    const {id} = useParams()


    function onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    }

    const submitHandler = async (val) => {
        const formData = new FormData()
        for (let key in val) {

            if (key === 'collectionImage') {
                if (typeof val[key] === "object") {
                    formData.append(key, new Blob([val[key].file.originFileObj]))
                    formData.append(`imgContentType`, val[key].file.originFileObj.type)
                }

            } else {
                formData.append(key, val[key])
            }
        }
        if (formData.get('collectionImage') === 'undefined') {
            formData.delete('collectionImage')
            formData.append('collectionImage', data.holderLogoImageAwsUuid)
        }

        setRequestLoading(true)
        await apiRequests.holders.edit(formData, data.id)
            .then(async (res) => {
                setRequestLoading(false)
                dispatch(setHolders([...mainSlice.holders, res.data]))
                message.success('Правообладатель успешно создан')
            })
            .catch((e) => {
                message.error(e.response.data.message || 'Произошла ошибка')
            })
    }

    useEffect(() => {
        console.log(id)
        const currentHolder = mainSlice.holders.find(i => i.id == id)
        if (currentHolder) {
            setData(currentHolder)
        }
    }, [mainSlice.holders]);

    return (
        <>
            <CreatingPage
                title='Изменение правообладателя'
            >
                {
                    data && (
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
                            <Form.Item initialValue={data.holderFullName} label={'ФИО'} name={'holderFullName'}>
                                <Input />
                            </Form.Item>
                            <Form.Item initialValue={data.holderEmail} label={'Почта'} name={'holderEmail'}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={'Изображение'} name={'collectionImage'}>
                                <Upload
                                    accept=".jpg, image/jpeg, .jpeg, image/jpeg"
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
                                <Button icon={isRequestLoading && <Spin size={'small'} />} style={{width: '15%'}} disabled={isRequestLoading} htmlType={'submit'}>Изменить</Button>
                            </Form.Item>
                        </Form>
                    )
                }


            </CreatingPage>
        </>
    )
}

export default EditHolder