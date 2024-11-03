import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice';
import redirectMiddleware from '../middlewares/redirectMiddleware';

const store = configureStore({
  reducer: apiSlice.rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.authApiSlice.middleware)
      .concat(apiSlice.carApiSlice.middleware)
      .concat(apiSlice.brandApiSlice.middleware)
      .concat(redirectMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
