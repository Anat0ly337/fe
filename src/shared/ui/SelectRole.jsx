import {Select} from "antd";

const roles = [
    {
        value: 'USER',
        key: 'USER'
    },
    {
        value: 'MODERATOR',
        key: 'MODERATOR'
    },
    {
        value: 'ADMIN',
        key: 'ADMIN'
    }
]

export const SelectRole = ({...props}) => {
    console.log(props)
    return (
            <Select
                {...props}
                options={roles}
            />
    )
}