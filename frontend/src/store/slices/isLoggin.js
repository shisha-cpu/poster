import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggin: false
}

export const isLogginSlice = createSlice({
    name: 'isLoggin',
    initialState,
    reducers: {
        loggin: (state) => {
            return {...state, isLoggin: true };
        }
    }
})

export const { loggin } = isLogginSlice.actions;
export default isLogginSlice.reducer;