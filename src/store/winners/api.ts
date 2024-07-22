import { createAsyncThunk } from '@reduxjs/toolkit';
import baseRequest, { ApiError } from '../../utils/baseApi';
import { OrderTypes, SortTypes, Winner } from './types';

interface GetWinnersResponse{
  winners: Winner[],
  totalCount:number
}
export const getWinnersAsync = createAsyncThunk<GetWinnersResponse, { page: number, limit: number, sort:SortTypes, order:OrderTypes }, { rejectValue: string }>('winners/get', async (reqBody, thunkAPI) => {
  try {
    const result = await baseRequest<Winner[]>('GET', `winners?_page=${reqBody.page}&_limit=${reqBody.limit}`);

    // get total items cound from header
    if (result) {
      const { headers, data } = result!;
      const totalCount = headers.get('X-Total-Count');
      return { winners: data, totalCount: +totalCount! } as GetWinnersResponse;
    }
    return thunkAPI.rejectWithValue('No winners found');
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const a = 2;
export {};
