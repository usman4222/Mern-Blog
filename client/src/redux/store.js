import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import themeReducer from './theme/themeSlice.js'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

//to store many reduers
const rootRducer = combineReducers({
  user: userReducer,
  theme: themeReducer
})

//to persist state in storage
const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const persistedReducer = persistReducer(persistConfig, rootRducer)

export const store = configureStore({
  reducer: persistedReducer,
  //middleware to prevent default error
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    { serializableCheck: false }
  )
})

export const persister = persistStore(store)