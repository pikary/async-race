export interface ApiError extends Error {
    statusCode: number;
    message: string;
  }
export function ApiErrorFactory(statusCode: number, message: string): ApiError {
  return {
    statusCode,
    message,
    name: 'a',
  };
}
export function isApiError(error: any): error is ApiError {
  return (
    error
      && typeof error.message === 'string'
      && typeof error.statusCode === 'number'
      && typeof error.name === 'string'
  );
}

// for aborting drive request
export interface AbortError extends Error {
    message: string;
    id: number;
  }
export function AbortErrorFactory(id: number, message: string): AbortError {
  return {
    id,
    message,
    name: 'AbortError',
  };
}
export function isAbortError(error: any): error is AbortError {
  return (
    error
      && typeof error.message === 'string'
      && typeof error.id === 'number'
      && typeof error.name === 'string'
  );
}
