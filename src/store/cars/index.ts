/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car, EngineStatuses, Race } from './types';
import { SliceState } from '../types';
import { generateRandomCars } from './helpers';
import {
  getCarsAsync, createCarAsync, deleteCarAsync, updateCarAsync,
  toggleCarEngineAsync,
  driveCarAsync,
} from './api';
import { isApiError } from '../../utils/baseApi';

interface CarsSliceState extends SliceState<Car[] | undefined> {
  currentPage: number,
  totalAmount: number,
  selectedCar: Car | null,
  race: Race | null
}
const initialState: CarsSliceState = {
  isLoading: false,
  data: [],
  error: undefined,
  currentPage: 1,
  totalAmount: 0,
  selectedCar: null,
  race: null,
};

const CarsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    createCar: (state, action: PayloadAction<Car>) => {
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
    setCurrentPage: (state, action: PayloadAction<number>) => {
      const maxPages = Math.ceil(state.totalAmount / 7);
      if (action.payload === 0 || action.payload > maxPages) {
        return;
      }
      state.currentPage = action.payload;
    },
    selectCar: (state, action: PayloadAction<Car>) => {
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
    updateCarProgress: (state, action: PayloadAction<{ id: number, progress: string }>) => {
      const car = state.race?.cars.find((el) => el.id === action.payload.id);
      // console.log('I AM UPDATING');

      if (car) {
        car.progress = action.payload.progress;
      }
    },
    stopCar: (state, action: PayloadAction<number>) => {
      // console.log(action.payload);

      if (state.data) {
        const car = state.data.find((el) => el.id === action.payload);
        car!.engineStatus = EngineStatuses.STOPPED;
      }
    },
    createRace: (state, action: PayloadAction<{ currentPage: number, cars: Car[] }>) => {
      state.race = {
        page: action.payload.currentPage,
        cars: action.payload.cars,
        status: 'started',
      };
      // console.log(state.race);
    },
    updateCarList: (state, action: PayloadAction<Car[]>) => {
      state.data = action.payload;
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
      })
      .addCase(toggleCarEngineAsync.fulfilled, (state, action) => {
        if (state.data) {
          const index = state.data.findIndex((car) => car.id === action.meta.arg.id);
          if (index >= 0) {
            state.data[index] = {
              ...state.data[index],
              engineStatus: action.meta.arg.status,
              velocity: action.payload.velocity,
              distance: action.payload.distance,
            };
          }
        }
      })
      .addCase(toggleCarEngineAsync.rejected, (state, action) => {
        if (state.data) {
          const index = state.data.findIndex((car) => car.id === action.meta.arg.id);
          if (index >= 0) {
            state.data[index] = { ...state.data[index], engineStatus: EngineStatuses.STOPPED };
          }
        }
      })
      .addCase(driveCarAsync.rejected, (state, action) => {
        if (isApiError(action.payload)) {
          if (action.payload.statusCode === 500) {
            const carId = action.meta.arg;
            const carIndex = state.data!.findIndex((el) => el.id === carId);
            // const carToUpd = state.race?.cars.find((el) => el.id === carId);
            // if (carToUpd) carToUpd.engineStatus = EngineStatuses.FINISHED;
            if (carIndex !== -1) {
              state.data![carIndex].engineStatus = EngineStatuses.CRASHED;
              state.race!.cars![carIndex].engineStatus = EngineStatuses.CRASHED;
              // Instead of logging the car object, you could log other details if needed
              // console.log(`Car with id ${carId} has been stopped due to a server error.`);
            }
          }
        }
      })
      .addCase(driveCarAsync.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          const carId = action.meta.arg;
          const carIndex = state.data!.findIndex((el) => el.id === carId);
          // const carToUpd = state.race?.cars.find((el) => el.id === carId);
          // if (carToUpd) carToUpd.engineStatus = EngineStatuses.FINISHED;
          if (carIndex !== -1) {
            state.data![carIndex].engineStatus = EngineStatuses.FINISHED;
            const carToUpd = state.race?.cars[carIndex];
            carToUpd!.engineStatus = EngineStatuses.FINISHED;
            // const racecar = state.race!.cars.get(carId);
            // if (racecar)racecar.engineStatus = EngineStatuses.FINISHED;
            // Instead of logging the car object, you could log other details if needed
            // console.log(`Car with id ${carId} has finished yaaay`);
          }
        }
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
  stopCar,
  updateCarProgress,
  createRace,
  updateCarList,
} = CarsSlice.actions;

export default CarsSlice.reducer;
