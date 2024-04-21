import axios from "axios";
import {store} from "../store/store";
import {setAuth} from "../store/main";
import Cookies from "js-cookie";


export const axiosInstance = axios.create({
    baseURL: `https://dligjs37pj7q2.cloudfront.net/api`,
    headers: {
        "Authorization": `Bearer ${Cookies.get('accessToken')}`,
        "Content-Type": "application/json"
    },
});

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 401) {
        store.dispatch(setAuth(false))
    }
    return Promise.reject(error);
})