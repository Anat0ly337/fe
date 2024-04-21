import {axiosInstance} from "./axiosInstance";


export const apiRequests = {
    users: {
        get: async () => {
            return axiosInstance.get('/users?page=0&size=10')
        }
    }
}