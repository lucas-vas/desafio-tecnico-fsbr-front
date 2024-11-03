import { combineReducers } from '@reduxjs/toolkit';
import { authApiSlice } from './endpoints/authEndpoints';
import { carApiSlice } from './endpoints/carEndpoints';
import { brandApiSlice } from './endpoints/brandEndpoints';

const rootReducer = combineReducers({
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [carApiSlice.reducerPath]: carApiSlice.reducer,
  [brandApiSlice.reducerPath]: brandApiSlice.reducer,
});

export const apiSlice = {
  rootReducer,
  authApiSlice,
  carApiSlice,
  brandApiSlice,
};
