import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import blogSlice from "./slices/blogSlice";
import uiSlice from "./slices/uiSlice";


export const persistConfig = {
    key: "demo",
    version: 1,
    storage,
};
const combinedReducer = combineReducers({
    auth: authSlice,
    blogs : blogSlice,
    ui : uiSlice
})

const rootReducer = (state, action) => {
    return combinedReducer(state, action)
}

export const persistedReducer = persistReducer(persistConfig, rootReducer);