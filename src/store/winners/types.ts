/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export interface Winner{
    id:number,
    wins:number,
    time:number
}

export enum OrderTypes {
    ASC='ASC',
    DSC='DSC'
}

export enum SortTypes {
    ID='id',
    WIN='wins',
    TIME='time'
}

export function createDefaultWinner(overrides:Partial<Winner>):Winner {
  return {
    id: 0, wins: 0, time: 0, ...overrides,
  };
}
