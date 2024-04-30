import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    user: {},
    albums: [],
    authors: [],
    isAuth: true,
}

const mainSlice = createSlice({
    name: 'mainSlice',
    initialState,
    reducers: {
        setAuth (state, action) {
            state.isAuth = action.payload
        },
        setAlbums (state, action) {
            state.albums = action.payload
        },
        setAuthors (state, action) {
            state.authors = action.payload
        }
    }
})

export const {setAuth, setAuthors, setAlbums} = mainSlice.actions

export default mainSlice.reducer