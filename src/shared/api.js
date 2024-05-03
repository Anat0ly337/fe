import {axiosInstance} from "./axiosInstance";


export const apiRequests = {
    users: {
        get: async () => {
            return axiosInstance.get('/admin/users?size=100000')
        },
        getByIdDevice: async (id) => {
            return axiosInstance.get(`/admin/users/searchUserByDeviceId/${id}`)
        },
        getByEmail: async (email) => {
            return axiosInstance.get(`/admin/users/searchUserByEmail/${email}`)
        }
    },
    user: {
        update: async (id, body) => {
            return axiosInstance.put(`/admin/users/${id}`, body)
        },
        updateStatus: async (id, status) => {
            return axiosInstance.put(`/admin/users/blockUser/${id}/${status}`)
        },
        create: async (body) => {
            return axiosInstance.post(`/admin/users/create`, body)
        }
    },
    media: {
        get: async (page, size) => {
            return axiosInstance.get(`/admin/media?page=${page}&size=${size}`)
        },
        allAuthors: async () => {
            return axiosInstance.get(`/admin/media/authors`)
        },
        allAlbums: async () => {
            return axiosInstance.get(`/admin/media/albums`)
        },
        create: async (body) => {
            return axiosInstance.postForm(`/admin/media/upload`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/admin/media/${id}`)
        },
        update: async (id, body) => {
            return axiosInstance.put(`/admin/media/upload/${id}`, body, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

        }
    },
    authors: {
        create: async (body) => {
            return axiosInstance.post(`/admin/media/createAuthor`, body)
        }
    },
    albums: {
        create: async (body) => {
            return axiosInstance.postForm(`/admin/media/createAlbum`, body)
        }
    },
    advertisement: {
        getAll: async () => {
            return axiosInstance.get(`/admin/advertisement/contracts?size=10000`)
        },
        create: async (body) => {
            return axiosInstance.post(`/admin/advertisement/contract`, body)
        }
    },
    promocode: {
        getAll: async () => {
            return axiosInstance.get(`/admin/promocode/allCodes`)
        },
        create: async (body) => {
            return axiosInstance.post(`/admin/promocode/createCode`, body)
        }
    },
    logout: () => {
        return axiosInstance.get('/v1/auth/logout')
    }
}