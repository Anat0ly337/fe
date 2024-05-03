import axios from "axios";
import {store} from "../store/store";
import {setAuth} from "../store/main";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        'Access-Control-Allow-Credentials': true,
    }
});

axios.defaults.withCredentials = true

axiosInstance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('accessToken')

    if (!token) {
        store.dispatch(setAuth(false))
    }

    config.headers = {
        'Authorization': `Bearer ${token}`

    }

    return config
}, function (error) {
    return Promise.reject(error)
});

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 401) {
        return store.dispatch(setAuth(false))
    }
        return Promise.reject(error);
})