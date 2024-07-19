export interface SliceState<T>{
  isLoading: boolean;
  data: T;
  error: string | null |undefined;
}
