import {Button, Flex, Image, Modal} from "antd";
import {DatabaseOutlined} from "@ant-design/icons";
import {useState} from "react";
import {apiRequests} from "../../shared/api";
import Paragraph from "antd/es/typography/Paragraph";
import {axiosInstance} from "../../shared/axiosInstance";


export const Advertisement = ({data}) => {
    const [isActive, setActive] = useState(false)
    const [pictures, setPictures] = useState([])
    const showModal = () => {
        data.advertisementData.map(i => {
            axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net/api/v1/media/${i.imageAwsUuid}`, {
                responseType: 'blob'
            })
                .then((res) => {
                    const imageUrl = URL.createObjectURL(res.data)
                    console.log(data)
                    if (pictures.length < data.advertisementData.length) {
                        setPictures(prev => [...prev, imageUrl])
                    }
                })
        })
        setActive(true)
    }

    return (
        <>
            <Button icon={<DatabaseOutlined />} onClick={showModal} />
            <Modal
                title={'Рекламные баннеры'}
                footer={[]}
                open={isActive}
                onCancel={() => setActive(false)}
            >
                <Flex style={{marginTop: '20px'}} vertical gap={'10px'}>
                    {
                        !data.advertisementData.length ? <Paragraph>Фотографии отсутствуют</Paragraph> : pictures.map((i) => (
                            <Image src={i} />
                        ))
                    }
                </Flex>
            </Modal>
        </>

    )
}