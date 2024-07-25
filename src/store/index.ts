import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import CarsReducer from './cars';
import WinnersReducer from './winners';

const rootReducer = combineReducers({ cars: CarsReducer, winners: WinnersReducer });

const store = configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;