import { createAsyncThunk } from '@reduxjs/toolkit';
import { Car } from './types';
import baseRequest from '../../utils/baseApi';

interface CarReqBody{
  name:string,
  color:string
}

export const getCarsAsync = createAsyncThunk<Car[], { page: number, limit: number }, { rejectValue: string }>('garage/getcars', async (reqBody, thunkAPI) => {
  try {
    const result = await baseRequest<Car[]>('GET', `garage?_page=${reqBody.page}&_limit=${2}`);
    if (!Array.isArray(result)) {
      return thunkAPI.rejectWithValue('Invalid response format');
    }
    console.log(result);

    return result as Car[];
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const getCarAsync = createAsyncThunk<Car|undefined, number, { rejectValue: string }>('garage/getcar', async (id, thunkAPI) => {
  try {
    const result = await baseRequest<Car>('GET', `garage/${id}`);
    return result as Car;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const createCarAsync = createAsyncThunk<Car|undefined, CarReqBody, { rejectValue: string }>('garage/create', async (reqBody, thunkAPI) => {
  try {
    const result = await baseRequest<Car>('POST', 'garage', reqBody);
    return result as Car;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const deleteCarAsync = createAsyncThunk<boolean, number, { rejectValue: string }>('garage/delete', async (id, thunkAPI) => {
  try {
    await baseRequest<Car>('DELETE', `garage/${id}`);
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
export const a = 2;

export const updateCarAsync = createAsyncThunk<Car|undefined, Car, { rejectValue: string }>('garage/update', async (reqBody, thunkAPI) => {
  try {
    const { id, name, color } = reqBody;
    const newValue = { name, color };
    const result = await baseRequest<Car>('PUT', `garage/${id}`, newValue);
    return result as Car;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
