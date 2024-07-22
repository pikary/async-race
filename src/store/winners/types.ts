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
