import {axiosInstance} from "./axiosInstance";


export const apiRequests = {
    users: {
        get: async () => {
            return axiosInstance.get('/admin/users?page=0&size=10')
        }
    }
}