/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car } from './types';
import { SliceState } from '../types';
import { generateRandomCars } from './helpers';

interface CarsSliceState extends SliceState<Car[]|undefined> {
  currentPage:number,
}
const initialState: CarsSliceState = {
  isLoading: false,
  data: [],
  error: undefined,
  currentPage: 1,
};

const CarsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createCar: (state, action:PayloadAction<Car>) => {
      state.data?.push(action.payload);
    },
    deleteCar: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data = state.data.filter((car) => car.id !== action.payload);
      }
    },
    generateCars: (state) => {
      const generatedCars = generateRandomCars(100);
      if (state.data) {
        state.data = state.data.concat(generatedCars);
      } else {
        state.data = generatedCars;
      }
    },
    setCurrentPage: (state, action:PayloadAction<number>) => {
      const length = state.data?.length || 0;
      const maxPages = Math.ceil(length / 7);
      if (action.payload === 0 || action.payload > maxPages) {
        return;
      }
      state.currentPage = action.payload;
    },
  },
});

export const {
  createCar, deleteCar, generateCars, setCurrentPage,
} = CarsSlice.actions;

export default CarsSlice.reducer;
