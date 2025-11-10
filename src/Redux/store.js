import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Redux/slice/loginSlice";
import commonReducer from "../Redux/slice/commonSlice";
import { persistReducer,persistStore  } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  login: loginReducer,
  common: commonReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
