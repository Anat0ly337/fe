import Title from "antd/es/typography/Title";
import {Flex} from "antd";


const CreatingPage = ({title, children}) => {
    return (
        <Flex style={{width: '100%'}} vertical justify={'center'} align={'center'} gap={20}>
            <Title level={2}>{title}</Title>
            {children}
        </Flex>
    )
}

export default CreatingPage