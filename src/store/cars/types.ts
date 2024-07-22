/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export type EngineStatus = 'started' | 'stopped' | 'drive'
export enum EngineStatuses{
  STARTED='started',
  STOPPED='stopped',
  DRIVE='drive'
}
export interface Car{
  name:string,
  color:string,
  id:number,
  velocity:number,
  distance:number,
  engineStatus:EngineStatuses
}

const defaultCar: Car = {
  name: '',
  color: '',
  id: 0,
  velocity: 0,
  distance: 0,
  engineStatus: EngineStatuses.STOPPED,
};

export function createCarWithDefaults(overrides: Partial<Car> = {}): Car {
  return { ...defaultCar, ...overrides };
}
