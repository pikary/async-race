import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car } from './types';
import { SliceState } from '../types';

const initialState: SliceState<Car[] | undefined> = {
  isLoading: false,
  data: undefined,
  error: undefined,
};

const CarsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createCar: (state, action:PayloadAction<Car>) => {
      state.data?.push(action.payload);
    },
  },

});

// export const {} = EducationSlice.actions;
export default CarsSlice.reducer;
