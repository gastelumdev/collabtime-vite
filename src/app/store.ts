import { configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'
import authReducer from '../features/auth/authSlice'
import tableReducer from "../components/table/tableSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    table: tableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch