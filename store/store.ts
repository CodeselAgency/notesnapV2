import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import pdfReducer from './slices/pdfSlice'
import boardReducer from './slices/boardSlice'
import profileReducer from './slices/profileSlice'
import chatReducer from './slices/chatSlice'
import subscriptionReducer from './slices/subscriptionSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        pdf: pdfReducer,
        board: boardReducer,
        profile: profileReducer,
        chat: chatReducer,
        subscription: subscriptionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['auth.user'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch