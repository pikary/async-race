/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Winner } from './types';
import { SliceState } from '../types';
import { getWinnersAsync, updateWinnerAsync, createWinnerAsync } from './api';
import { isApiError } from '../../utils/baseApi';

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
  extraReducers(builder) {
    builder.addCase(getWinnersAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getWinnersAsync.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getWinnersAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload.winners;
      state.totalAmount = action.payload.totalCount;
    });
    builder.addCase(createWinnerAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createWinnerAsync.rejected, (state, action) => {
      if (isApiError(action.payload)) {
        state.isLoading = false;
        state.error = action.payload.message;
      }
    });
    builder.addCase(createWinnerAsync.fulfilled, (state, action) => {
      if (state.data) {
        state.data.push(action.payload);
      }
    });
    builder.addCase(updateWinnerAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateWinnerAsync.rejected, (state, action) => {
      if (isApiError(action.payload)) {
        state.isLoading = false;
        state.error = action.payload.message;
      }
    });
    builder.addCase(updateWinnerAsync.fulfilled, (state, action) => {
      if (state.data) {
        const index = state.data.findIndex((winner) => winner.id === action.payload?.id);
        if (index >= 0) {
          state.data[index] = action.payload!;
        }
      }
    });
  },

});

// export const {} = CarsSlice.actions;

export default WinnerSlice.reducer;
