import { createAsyncThunk } from '@reduxjs/toolkit';
import baseRequest from '../../utils/baseApi/baseApi';
import { isApiError, ApiError } from '../../utils/baseApi/types';
import { OrderTypes, SortTypes, Winner } from './types';
import { Car } from '../cars/types';

interface GetWinnersResponse {
    winners: Winner[];
    totalCount: number;
}

export const getWinnerAsync = createAsyncThunk<
    Winner | undefined,
    number,
    { rejectValue: ApiError | string }
>('winners/getone', async (id, thunkAPI) => {
    try {
        const result = await baseRequest<Winner>('GET', `winners/${id}`, null);
        return result?.data;
    } catch (e) {
        if (isApiError(e)) {
            if (e.statusCode === 404) {
                return thunkAPI.rejectWithValue(e);
            }
        }
        return thunkAPI.rejectWithValue((e as Error).message);
    }
});

export const getWinnersAsync = createAsyncThunk<
    GetWinnersResponse,
    { page: number; limit: number; sort: SortTypes; order: OrderTypes },
    { rejectValue: string }
>('winners/get', async (reqBody, thunkAPI) => {
    try {
        const result = await baseRequest<Winner[]>(
            'GET',
            `winners?_page=${reqBody.page}&_limit=${reqBody.limit}&_sort=${reqBody.sort}&_order=${reqBody.order}`
        );

        // get total items cound from header
        if (result) {
            const { headers, data } = result!;
            const totalCount = headers.get('X-Total-Count');
            const winnersWithCars = await Promise.all(
                data.map(async (winner) => {
                    // const winnerResult = await baseRequest<Winner>('GET', `winners/${winner.id}`);
                    const carResult = await baseRequest<Car>(
                        'GET',
                        `garage/${winner?.id}`
                    );
                    return { ...winner, car: carResult?.data };
                })
            );
            // console.log(result.data);

            return {
                winners: winnersWithCars,
                totalCount: +totalCount!,
            } as GetWinnersResponse;
        }
        return thunkAPI.rejectWithValue('No winners found');
    } catch (e) {
        return thunkAPI.rejectWithValue((e as Error).message);
    }
});

export const createWinnerAsync = createAsyncThunk<
    Winner,
    Winner,
    { rejectValue: ApiError | string }
>('winners/create', async (reqbody, thunkAPI) => {
    try {
        const result = await baseRequest<Winner>('POST', 'winners', reqbody);
        if (result) {
            return result.data;
        }
        return thunkAPI.rejectWithValue('asd');
    } catch (e) {
        if (isApiError(e)) {
            return thunkAPI.rejectWithValue({
                statusCode: e.statusCode,
                message: e.message,
                name: '',
            });
        }
        return thunkAPI.rejectWithValue((e as Error).message);
    }
});

export const updateWinnerAsync = createAsyncThunk<
    Winner,
    Winner,
    { rejectValue: string | ApiError }
>('winners/update', async (reqbody, thunkAPI) => {
    try {
        const result = await baseRequest<Winner>(
            'PUT',
            `winners/${reqbody.id}`,
            reqbody
        );
        if (result) {
            return result.data;
        }
        return thunkAPI.rejectWithValue('asd');
    } catch (e) {
        if (isApiError(e)) {
            return thunkAPI.rejectWithValue({
                statusCode: e.statusCode,
                message: e.message,
                name: '',
            });
        }
        return thunkAPI.rejectWithValue((e as Error).message);
    }
});

export const a = 2;
export {};
