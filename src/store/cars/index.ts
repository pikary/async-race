/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Car, EngineStatuses, Race, RaceStatuses,
} from './types';
import { SliceState } from '../types';
import {
  getCarsAsync,
  createCarAsync,
  deleteCarAsync,
  updateCarAsync,
  toggleCarEngineAsync,
  driveCarAsync,
} from './api';
import { isAbortError, isApiError } from '../../utils/baseApi/types';

interface FormState {
  name: string;
  color: string;
}
interface CarsSliceState extends SliceState<Car[] | undefined> {
  currentPage: number;
  totalAmount: number;
  selectedCar: Car | null;
  race: Race;
  createform: FormState;
  updateForm: FormState;
}
const initialState: CarsSliceState = {
  isLoading: false,
  data: [],
  error: undefined,
  currentPage: 1,
  totalAmount: 0,
  selectedCar: null,
  race: {
    cars: [],
    status: 'idle',
    page: 0,
    winner: null,
  },
  createform: {
    name: '',
    color: '',
  },
  updateForm: {
    name: '',
    color: '',
  },
};

const CarsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCreateFormField(
      state,
      action: PayloadAction<{ field: keyof FormState; value: string }>,
    ) {
      state.createform[action.payload.field] = action.payload.value;
    },
    clearForm(state) {
      state.createform = { name: '', color: '' };
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
    updateCarProgress: (
      state,
      action: PayloadAction<{ id: number; progress: string }>,
    ) => {
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
    createRace: (
      state,
      action: PayloadAction<{ currentPage: number; cars: Car[] }>,
    ) => {
      state.race = {
        page: action.payload.currentPage,
        cars: action.payload.cars,
        status: RaceStatuses.STARTED,
        winner: null,
      };
      // console.log(state.race);
    },
    updateRaceParticipants: (state, action: PayloadAction<{ car: Car }>) => {
      state.race.cars.push(action.payload.car);
    },
    updateRaceStatus: (state, action: PayloadAction<string>) => {
      state.race.status = action.payload;
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
          state.totalAmount -= 1;
          if (state.data?.length === 0) {
            if (state.currentPage > 1) {
              state.currentPage -= 1;
            }
          }
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
          const index = state.data.findIndex(
            (car) => car.id === action.payload?.id,
          );
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
          const { status } = action.meta.arg;
          const index = state.data.findIndex(
            (car) => car.id === action.meta.arg.id,
          );
          if (index >= 0) {
            state.data[index] = {
              ...state.data[index],
              engineStatus: action.meta.arg.status,
              velocity: status === EngineStatuses.STOPPED ? 0 : action.payload.velocity,
              distance: status === EngineStatuses.STOPPED ? 0 : action.payload.distance,
            };
          }
          state.race.cars[index] = {
            ...state.data[index],
            engineStatus: action.meta.arg.status,
            velocity: status === EngineStatuses.STOPPED ? 0 : action.payload.velocity,
            distance: status === EngineStatuses.STOPPED ? 0 : action.payload.distance,
          };
        }
      })
      .addCase(toggleCarEngineAsync.rejected, (state, action) => {
        if (state.data) {
          const index = state.data.findIndex(
            (car) => car.id === action.meta.arg.id,
          );

          if (index >= 0) {
            state.data[index] = {
              ...state.data[index],
              engineStatus: EngineStatuses.STOPPED,
            };
            state.race.cars[index] = {
              ...state.data[index],
              engineStatus: EngineStatuses.STOPPED,
            };
          }
        }
      })
      .addCase(driveCarAsync.rejected, (state, action) => {
        const carId = action.meta.arg;

        if (isAbortError(action.payload)) {
          console.log('ITS ABORT ERRRO AYE', action.payload, carId);

          const carIndex = state.data!.findIndex((el) => el.id === carId);
          if (carIndex !== -1) {
            state.data![carIndex].engineStatus = EngineStatuses.STOPPED;
            state.race!.cars![carIndex].engineStatus = EngineStatuses.STOPPED;
          }
        } else if (isApiError(action.payload)) {
          if (action.payload.statusCode === 500) {
            const carIndex = state.data!.findIndex((el) => el.id === carId);
            if (carIndex !== -1) {
              state.data![carIndex].engineStatus = EngineStatuses.CRASHED;
              state.race!.cars![carIndex].engineStatus = EngineStatuses.CRASHED;
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
  setCurrentPage,
  selectCar,
  updateSelectedCarColor,
  updateSelectedCarName,
  stopCar,
  updateCarProgress,
  createRace,
  updateCarList,
  updateRaceStatus,
  updateRaceParticipants,
  setCreateFormField,
  clearForm,
} = CarsSlice.actions;

export default CarsSlice.reducer;
