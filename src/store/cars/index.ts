/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car } from './types';
import { SliceState } from '../types';
import { generateRandomCars } from './helpers';
import {
  getCarsAsync, createCarAsync, deleteCarAsync, updateCarAsync,
} from './api';

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
  extraReducers(builder) {
    builder
      .addCase(getCarsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getCarsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getCarsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cars';
      })
      .addCase(createCarAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createCarAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data?.push(action.payload!);
      })
      .addCase(createCarAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create car';
      })
      .addCase(deleteCarAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteCarAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && state.data) {
          state.data = state.data.filter((car) => car.id !== action.meta.arg);
        }
      })
      .addCase(deleteCarAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete car';
      })
      .addCase(updateCarAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateCarAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data) {
          const index = state.data.findIndex((car) => car.id === action.payload?.id);
          if (index >= 0) {
            state.data[index] = action.payload!;
          }
        }
      })
      .addCase(updateCarAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update car';
      });
  },
});

export const {
  createCar, deleteCar, generateCars, setCurrentPage,
} = CarsSlice.actions;

export default CarsSlice.reducer;
