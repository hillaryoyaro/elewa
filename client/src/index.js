import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
//This is specific if you are using redox persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE, 
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

//Get this information fron redox js toolkit for local storage from redox-toolkit library
const persistConfig = { key: "root",storage,version:1};
const persistedReducer = persistReducer(persistConfig,authReducer);
const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
      ignoreAction :[ FLUSH,REHYDRATE, PERSIST, PURGE, REGISTER ],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
