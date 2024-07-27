/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export type EngineStatus = 'started' | 'stopped' | 'drive';
export enum EngineStatuses {
  STARTED = 'started',
  STOPPED = 'stopped',
  CRASHED = 'crashed',
  DRIVE = 'drive',
  FINISHED = 'finished',
}
export enum RaceStatuses{
  IDLE='idle',
  FINISHED='finished',
  STARTED='started'
}

export interface Car {
  name: string;
  color: string;
  id: number;
  velocity: number;
  distance: number;
  engineStatus: EngineStatuses;
  progress: string | null;
}

export interface Race {
  cars: Car[];
  status: string;
  page: number;
  winner: Car | null;
}

const defaultCar: Car = {
  name: '',
  color: '',
  id: 0,
  velocity: 0,
  distance: 0,
  progress: null,
  engineStatus: EngineStatuses.STOPPED,
};

export function createCarWithDefaults(overrides: Partial<Car> = {}): Car {
  return { ...defaultCar, ...overrides };
}
