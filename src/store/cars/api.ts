import { createAsyncThunk } from '@reduxjs/toolkit';
import { Car, EngineStatuses } from './types';
import baseRequest, {
  AbortError,
  ApiError,
  isApiError,
} from '../../utils/baseApi';

interface CarReqBody {
  name: string;
  color: string;
}
const controllers = new Map<number, AbortController>();
interface GetGarageResponse {
  cars: Car[];
  totalCount: number;
}
export const getCarsAsync = createAsyncThunk<
  GetGarageResponse,
  { page: number; limit: number },
  { rejectValue: string }
>('garage/getcars', async (reqBody, thunkAPI) => {
  try {
    const result = await baseRequest<Car[]>(
      'GET',
      `garage?_page=${reqBody.page}&_limit=${reqBody.limit}`,
    );

    // get total items cound from header
    if (result) {
      const { headers, data } = result!;
      // (data);

      const totalCount = headers.get('X-Total-Count');
      return { cars: data, totalCount: +totalCount! } as GetGarageResponse;
    }
    return thunkAPI.rejectWithValue('No cars found');
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const getCarAsync = createAsyncThunk<
  Car | undefined,
  number,
  { rejectValue: string }
>('garage/getcar', async (id, thunkAPI) => {
  try {
    const result = await baseRequest<Car>('GET', `garage/${id}`);
    return result?.data as Car;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const createCarAsync = createAsyncThunk<
  Car | undefined,
  CarReqBody,
  { rejectValue: string }
>('garage/create', async (reqBody, thunkAPI) => {
  try {
    const result = await baseRequest<Car>('POST', 'garage', reqBody);

    return result?.data as Car;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const deleteCarAsync = createAsyncThunk<
  boolean,
  number,
  { rejectValue: string }
>('garage/delete', async (id, thunkAPI) => {
  try {
    await baseRequest<Car>('DELETE', `garage/${id}`);
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
export const a = 2;

export const updateCarAsync = createAsyncThunk<
  Car | undefined,
  Car,
  { rejectValue: string }
>('garage/update', async (reqBody, thunkAPI) => {
  try {
    const { id, name, color } = reqBody;
    const newValue = { name, color };
    const result = await baseRequest<Car>('PUT', `garage/${id}`, newValue);
    return result?.data as Car;
  } catch (e) {
    // @ts-ignore
    console.log(e);

    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

interface EngineResponse {
  velocity: number;
  distance: number;
}

export const toggleCarEngineAsync = createAsyncThunk<
  EngineResponse,
  { id: number; status: EngineStatuses },
  { rejectValue: string }
>('engine', async (reqBody, thunkAPI) => {
  try {
    const { id, status } = reqBody;
    let controller = controllers.get(id);
    if (status === EngineStatuses.STARTED) {
      const newController = new AbortController();
      controllers.set(id, newController);
      controller = newController;
    }
    if (status === EngineStatuses.STOPPED && controller) {
      controller?.abort();
      const result = await baseRequest<EngineResponse>(
        'PATCH',
        `engine?id=${id}&status=${status}`,
        null,
        {},
      );
      controllers.delete(id);
      return result?.data as EngineResponse;
    }
    const result = await baseRequest<EngineResponse>(
      'PATCH',
      `engine?id=${id}&status=${status}`,
      null,
      {},
    );

    return result?.data as EngineResponse;
  } catch (e) {
    // @ts-ignore
    // console.log(e);

    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

interface DriveCarResponse {
  success: boolean;
}
export const driveCarAsync = createAsyncThunk<
  DriveCarResponse,
  number,
  { rejectValue: ApiError | AbortError | string }
>('drive_engine', async (id, thunkAPI) => {
  try {
    const controller = controllers.get(id);

    const result = await baseRequest<{ success: boolean }>(
      'PATCH',
      `engine?id=${id}&status=drive`,
      null,
      { signal: controller?.signal },
    );

    return result?.data as DriveCarResponse;
  } catch (e: any) {
    if ((e as Error).name === 'AbortError') {
      console.log('Request was aborted');
      return thunkAPI.rejectWithValue({
        id,
        message: `Car ${id} was stopped while racing`,
        name: 'AbortError',
      });
    }

    if (isApiError(e)) {
      return thunkAPI.rejectWithValue({
        statusCode: e.statusCode,
        message: e.message,
        name: '',
      });
    }

    // console.log(e);
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
