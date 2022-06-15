import { configureStore } from '@reduxjs/toolkit';
import journeySlice from './reducers/journeySlice';
import userSlice from './reducers/userSlice';

export default configureStore({
    reducer: {
        users: userSlice,
        journeys: journeySlice
        
    }
})