import {Button, Flex, Image, Modal} from "antd";
import {DatabaseOutlined} from "@ant-design/icons";
import {useState} from "react";
import {apiRequests} from "../../shared/api";


export const Advertisement = ({data}) => {
    const [isActive, setActive] = useState(false)

    return (
        <>
            <Button icon={<DatabaseOutlined />} onClick={() => setActive(true)} />
            <Modal
                title={'Рекламные баннеры'}
                footer={[]}
                open={isActive}
                onCancel={() => setActive(false)}
            >
                <Flex style={{marginTop: '20px'}} vertical gap={'10px'}>
                    {
                        data.advertisementData.map((i) => (
                            <Image src={`${process.env.REACT_APP_API_URL}/v1/media/${i.imageAwsUuid}`} />
                        ))
                    }

                </Flex>
            </Modal>
        </>

    )
}