import { configureStore } from '@reduxjs/toolkit';
import connectSlice from './reducers/connectSlice';

export default configureStore({
    reducer: {
        connect: connectSlice
    }
})