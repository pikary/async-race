/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Winner } from './types';
import { SliceState } from '../types';

interface WinnersSliceState extends SliceState<Winner[]|undefined> {
  currentPage:number,
  totalAmount:number,
}
const initialState: WinnersSliceState = {
  isLoading: false,
  data: [],
  error: undefined,
  currentPage: 1,
  totalAmount: 0,
};

const WinnerSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {

  },

});

// export const {} = CarsSlice.actions;

export default WinnerSlice.reducer;
