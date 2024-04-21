import {useEffect} from "react";
import {apiRequests} from "../../shared/api";


const UsersPage = () => {

    useEffect(() => {
        apiRequests.users.get()
            .then((res) => {
                console.log(res.data)
            })
    }, []);


    return (
        <>
        </>
    )
}

export default UsersPage