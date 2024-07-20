export type EngineStatus = 'started' | 'stopped' | 'drive'
export interface Car{
  name:string,
  color:string,
  id?:number,
  velocity?:number|null,
  distance?:number|null,
  engineStatus?:EngineStatus
}
