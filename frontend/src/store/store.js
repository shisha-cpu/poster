import { configureStore } from "@reduxjs/toolkit";
import { isLogginSlice } from './slices/isLoggin';
import userReducer from './slices/user';

export const store = configureStore({
    reducer: {
        isLoggin: isLogginSlice.reducer,
        user: userReducer,
    }
});