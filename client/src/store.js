import {configureStore} from '@reduxjs/toolkit'
import authSliceReducer from './features/auth/authSlice'
export default configureStore({
    reducer: {
        auth: authSliceReducer
    },
})