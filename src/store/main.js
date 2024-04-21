import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    user: {},
    isAuth: false,
}

const mainSlice = createSlice({
    name: 'mainSlice',
    initialState,
    reducers: {
        setAuth (state, action) {
            state.users = action.payload
        }
    }
})

export const {setAuth} = mainSlice.actions

export default mainSlice.reducer