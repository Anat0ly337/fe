import {axiosInstance} from "./axiosInstance";


export const apiRequests = {
    users: {
        get: async (size = 10, page = 0) => {
            return axiosInstance.get(`/api/admin/users?size=${size}&page=${page}`)
        },
        getByIdDevice: async (id) => {
            return axiosInstance.get(`/api/admin/users/searchUserByDeviceId/${id}`)
        },
        getByEmail: async (email) => {
            return axiosInstance.get(`/api/admin/users/searchUserByEmail/${email}`)
        }
    },
    user: {
        update: async (id, body) => {
            return axiosInstance.put(`/api/admin/users/${id}`, body)
        },
        updateStatus: async (id, status) => {
            return axiosInstance.put(`/api/admin/users/blockUser/${id}/${status}`)
        },
        create: async (body) => {
            return axiosInstance.post(`/api/admin/users/create`, body)
        }
    },
    media: {
        get: async (page, size) => {
            return axiosInstance.get(`/api/admin/media?page=${page}&size=${size}`)
        },
        allAuthors: async () => {
            return axiosInstance.get(`/api/admin/media/authors`)
        },
        allAlbums: async () => {
            return axiosInstance.get(`/api/admin/media/albums`)
        },
        create: async (body) => {
            return axiosInstance.postForm(`/api/admin/media/upload`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/api/admin/media/${id}`)
        },
        update: async (id, body) => {
            return axiosInstance.put(`/api/admin/media/upload/${id}`, body, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

        },
        search: async (value) => {
            return axiosInstance.get(`/api/v1/search/fullTextSearch?input=${value}&sortBy=DEFAULT&sortMethod=ASC`, {
                params: {
                    size: 10
                }
            })
        },
        getText: async (id) => {
            return axiosInstance.get(`/api/v1/media/${id}/text`)
        },
        searchByFile: async (name) => {
            return axiosInstance.get(`/v2/api/admin/media/getSongByOriginalFilename/${name}`)
        }
    },
    authors: {
        create: async (body) => {
            return axiosInstance.post(`/api/admin/media/createAuthor`, body)
        },
        getSongs: async (id) => {
            return axiosInstance.get(`/api/admin/statistics/getSongsStatisticsByAuthorId/${id}`)
        },
        getByName: async (name) => {
            return axiosInstance.get(`/v2/api/admin/media/getAuthorByName/${name}`)
        },
    },
    albums: {
        create: async (body) => {
            return axiosInstance.postForm(`/api/admin/media/createAlbum`, body)
        },
        getByName: async (name) => {
            return axiosInstance.get(`/v2/api/admin/media/getAlbumByName/${name}`)
        },
    },
    advertisement: {
        getAll: async (size = 10, page = 0) => {
            return axiosInstance.get(`/api/admin/advertisement/contracts`, {
                params: {
                    page, size
                }
            })
        },
        create: async (body) => {
            return axiosInstance.post(`/api/admin/advertisement/contract`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/api/admin/advertisement/delete/${id}`)
        }
    },
    promocode: {
        getAll: async () => {
            return axiosInstance.get(`/api/admin/promocode/allCodes`)
        },
        create: async (body) => {
            return axiosInstance.post(`/api/admin/promocode/createCode`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/api/admin/promocode/delete/${id}`)
        },
    },
    statistics: {
        popularSongs: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/api/admin/statistics/popularTracks`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        sungSongs: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/api/admin/statistics/sungSong`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        songSearchAnalytic: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/api/admin/statistics/songSearchAnalytics`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        deviceActivity: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/api/admin/statistics/deviceActivity`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        songSearchNotResult: async ({dateFrom, dateTo}, page = 0, size = 10) => {
            return axiosInstance.get(`/api/admin/statistics/songSearchNotFoundRequests`, {
                params: {
                    dateFrom,
                    dateTo,
                    page,
                    size
                }
            })
        },
        moneyDistribution: async () => {
            return axiosInstance.get(`/api/admin/statistics/moneyDistribution`)
        },
    },
    holders: {
        getAll: async () => {
            return axiosInstance.get(`/v2/api/admin/media/getAllCopyrightHolders?page=0&size=100`)
        },
        create: async (body) => {
            return axiosInstance.postForm(`/v2/api/admin/media/createCopyrightHolder`, body)
        },
        edit: async (body, id) => {
            return axiosInstance.put(`/v2/api/admin/media/updateCopyrightHolder/${id}`, body)
        },
        delete: async (id) => {
            return axiosInstance.delete(`/v2/api/admin/media/deleteCopyrightHolder/${id}`)
        },
        getByName: async (name) => {
            return axiosInstance.get(`/v2/api/admin/media/getAuthorByName/${name}`)
        },
    },
    collection: {
        getAll: async () => {
            return axiosInstance.get('/v2/api/admin/media/getAllCollections', {
                params: { page: 0, size: 50 }
            })
        },
        delete: async (id) => {
            return axiosInstance.delete(`/v2/api/admin/media/deleteCollection/${id}`)
        },
        update: async (id, body) => {
            return axiosInstance.put(`/v2/api/admin/media/updateCollection/${id}`, body)
        },
        create: async (body) => {
            return axiosInstance.postForm(`/v2/api/admin/media/createCollection`, body)
        },
        deleteSongOfCollection: async (id) => {
            return axiosInstance.delete(`/v2/api/admin/media/deleteSongFromCollection/${id}`)
        }, 
        addSong: async (body) => {
            return axiosInstance.post(`/v2/api/admin/media/addSongsToCollection`, body)
        }
    },
    logout: () => {
        return axiosInstance.get('/api/v1/auth/logout')
    }
}