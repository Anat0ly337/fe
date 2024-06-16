import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    user: {},
    albums: [],
    authors: [],
    holders: [],
    songs: [],
    collection: [],
    isAuth: true,
}

const mainSlice = createSlice({
    name: 'mainSlice',
    initialState,
    reducers: {
        setCollection (state, action) {
            state.collection = action.payload
        },
        setAuth (state, action) {
            state.isAuth = action.payload
        },
        setAlbums (state, action) {
            state.albums = action.payload
        },
        setHolders (state, action) {
            state.holders = action.payload
        },
        setAuthors (state, action) {
            state.authors = action.payload
        },
        setSongs (state, action) {
            state.songs = action.payload
        },
    }
})

export const {setAuth, setCollection, setSongs, setHolders, setAuthors, setAlbums} = mainSlice.actions

export default mainSlice.reducer