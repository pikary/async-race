/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderTypes, SortTypes, Winner } from './types';
import { SliceState } from '../types';
import { getWinnersAsync, updateWinnerAsync, createWinnerAsync } from './api';
import { isApiError } from '../../utils/baseApi';

interface WinnersSliceState extends SliceState<Winner[]|undefined> {
  currentPage:number,
  totalAmount:number,
  sort:SortTypes,
  order:OrderTypes,
  filter:Record<SortTypes, {active:boolean, order:OrderTypes}>
}
const initialState: WinnersSliceState = {
  isLoading: false,
  data: [],
  error: undefined,
  currentPage: 1,
  totalAmount: 0,
  order: OrderTypes.ASC,
  sort: SortTypes.ID,
  filter: {
    [SortTypes.ID]: { active: true, order: OrderTypes.DSC },
    [SortTypes.TIME]: { active: false, order: OrderTypes.DSC },
    [SortTypes.WIN]: { active: false, order: OrderTypes.DSC },
  },
};

const WinnerSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setCurrentPage: (state, action:PayloadAction<number>) => {
      const maxPages = Math.ceil(state.totalAmount / 7);
      if (action.payload === 0 || action.payload > maxPages) {
        return;
      }
      state.currentPage = action.payload;
    },
    setSortType: (state, action:PayloadAction<SortTypes>) => {
      state.sort = action.payload;
    },
    setOrderType: (state, action:PayloadAction<OrderTypes>) => {
      state.order = action.payload;
    },
    setTableFilters: (state, action:PayloadAction<{order:OrderTypes, sort:SortTypes}>) => {
      state.sort = action.payload.sort;
      state.order = action.payload.order;
    },
  },
  extraReducers(builder) {
    builder.addCase(getWinnersAsync.pending, (state) => {
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
    builder.addCase(createWinnerAsync.pending, (state) => {
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
    builder.addCase(updateWinnerAsync.pending, (state) => {
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

export const {
  setCurrentPage, setOrderType, setSortType, setTableFilters,
} = WinnerSlice.actions;

export default WinnerSlice.reducer;
