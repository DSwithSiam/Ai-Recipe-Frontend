import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./feature/authApi"; //  Import authApi
import authReducer from "./authSlice"
import ApiSlice from "./feature/ApiSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [ApiSlice.reducerPath]: ApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, ApiSlice.middleware), //  Add API middleware
});

export default store;