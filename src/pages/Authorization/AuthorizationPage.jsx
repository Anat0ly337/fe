import {Button, Flex, Form, Input} from "antd";
import {useState} from "react";
import {LoginForm} from "../../components/forms/Login";
import {RegistrationForm} from "../../components/forms/Registration";


const AuthorizationPage = () => {
    const [isReg, setReg] = useState(false)
    return (
        <Flex style={{height: '100%'}} justify={'center'} align={'center'}>
            {
                !isReg ? <LoginForm setReg={() => setReg(true)} /> : <RegistrationForm setReg={() => setReg(false)} />
            }
        </Flex>
    )
}

export default AuthorizationPage