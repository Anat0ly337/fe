import {Button, message, Modal} from "antd";
import {useState} from "react";
import {axiosInstance} from "../../shared/axiosInstance";
import Paragraph from "antd/es/typography/Paragraph";


export const TextSong = ({url}) => {
    const [isActive, setActive] = useState(false)
    const [text, setText] = useState('')

    const queryText = async () => {
        const newUrl = url.replace('/api', '')
        await axiosInstance.get(newUrl)
            .then((res) => {
                if (res.data.textLength === 0) {
                    message.info('Текст отсутствует')
                } else {
                    // const text = res.data.text.replace(' ', <br/>)
                    const h = res.data.text.replace(/\n\r?/g, `<br />`)
                    console.log(h)
                    setText(h)
                    setActive(true)
                }
            }).catch(() => message.error('Произошла ошибка'))

    }

    return (
        <>
            <Button
                onClick={queryText}
                type={'link'}
            >
                Открыть текст
            </Button>

            <Modal
                footer={[]}
                title={'Текст песни'}
                open={isActive}
                onCancel={() => setActive(false)}
            >
                <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }} />
            </Modal>
        </>
    )
}