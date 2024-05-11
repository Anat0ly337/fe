import {axiosInstance} from "./axiosInstance";


export const apiRequests = {
    users: {
        get: async (size = 10, page = 0) => {
            return axiosInstance.get(`/admin/users?size=${size}&page=${page}`)
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

        },
        getText: async (id) => {
            return axiosInstance.get(`/v1/media/${id}/text`)
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
        getAll: async (size = 10, page = 0) => {
            return axiosInstance.get(`/admin/advertisement/contracts`, {
                params: {
                    page, size
                }
            })
        },
        create: async (body) => {
            return axiosInstance.post(`/admin/advertisement/contract`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/admin/advertisement/delete/${id}`)
        }
    },
    promocode: {
        getAll: async () => {
            return axiosInstance.get(`/admin/promocode/allCodes`)
        },
        create: async (body) => {
            return axiosInstance.post(`/admin/promocode/createCode`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/admin/promocode/delete/${id}`)
        },
    },
    statistics: {
        popularSongs: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/admin/statistics/popularTracks`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        sungSongs: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/admin/statistics/sungSong`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        songSearchAnalytic: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/admin/statistics/songSearchAnalytics`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        deviceActivity: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/admin/statistics/deviceActivity`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        songSearchNotResult: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/admin/statistics/songSearchNotFoundRequests`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        moneyDistribution: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/admin/statistics/moneyDistribution`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
    },

    logout: () => {
        return axiosInstance.get('/v1/auth/logout')
    }
}