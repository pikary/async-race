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
  totalAmount:number,
  selectedCar:Car|null
}
const initialState: CarsSliceState = {
  isLoading: false,
  data: [],
  error: undefined,
  currentPage: 1,
  totalAmount: 0,
  selectedCar: null,
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
      const maxPages = Math.ceil(state.totalAmount / 7);
      if (action.payload === 0 || action.payload > maxPages) {
        return;
      }
      state.currentPage = action.payload;
    },
    selectCar: (state, action:PayloadAction<Car>) => {
      if (state.selectedCar && state.selectedCar.id === action.payload.id) {
        state.selectedCar = null;
      } else {
        state.selectedCar = action.payload;
      }
    },
    updateSelectedCarName: (state, action: PayloadAction<string>) => {
      if (state.selectedCar) {
        state.selectedCar.name = action.payload;
      }
    },
    updateSelectedCarColor: (state, action: PayloadAction<string>) => {
      if (state.selectedCar) {
        state.selectedCar.color = action.payload;
      }
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
        state.data = action.payload.cars;
        state.totalAmount = action.payload.totalCount;
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
        if (state.data) {
          if (state.data?.length < 7) {
            state.data?.push(action.payload!);
          }
        }
        state.totalAmount += 1;
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
          // action.meta.arg - это он берет параметр айди который кидали в thunk
          state.data = state.data.filter((car) => car.id !== action.meta.arg);
        }
        state.totalAmount -= 1;
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
  createCar,
  deleteCar,
  generateCars,
  setCurrentPage,
  selectCar,
  updateSelectedCarColor,
  updateSelectedCarName,
} = CarsSlice.actions;

export default CarsSlice.reducer;
