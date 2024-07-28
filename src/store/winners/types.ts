/* eslint-disable no-unused-vars */

import { Car } from '../cars/types';

/* eslint-disable no-shadow */
export interface Winner {
    id: number;
    wins: number;
    time: string;
    car?: Car;
}

export enum OrderTypes {
    ASC = 'ASC',
    DSC = 'DESC',
}

export enum SortTypes {
    ID = 'id',
    WIN = 'wins',
    TIME = 'time',
}

export function createDefaultWinner(overrides: Partial<Winner>): Winner {
    return {
        id: 0,
        wins: 0,
        time: '',
        ...overrides,
    };
}
