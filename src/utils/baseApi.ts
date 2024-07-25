const API_URL = 'http://127.0.0.1:3000';

interface Config {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  [key: string]: any;
}
interface ApiResponse<ReturnType>{
  data: ReturnType;
  headers: Headers;
  statusCode: number;
}

export interface ApiError extends Error{
  statusCode:number,
  message:string
}
function ApiErrorFactory(statusCode:number, message:string):ApiError {
  return {
    statusCode, message, name: 'a',
  };
}
export function isApiError(error: any): error is ApiError {
  return error && typeof error.message === 'string' && typeof error.statusCode === 'number' && typeof error.name === 'string';
}

export interface AbortError extends Error{
  message:string,
  id:number
}
export function AbortErrorFactory(id:number, message:string):AbortError {
  return {
    id, message, name: 'AbortError',
  };
}
export function isAbortError(error: any): error is AbortError {
  return error && typeof error.message === 'string' && typeof error.id === 'number' && typeof error.name === 'string';
}

const baseRequest = async <ReturnType>(
  method: string,
  url: string,
  body: any = null,
  config: Config = {},
): Promise<ApiResponse<ReturnType> | undefined> => {
  try {
    const req = await fetch(`${API_URL}/${url}`, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        ...config.headers,
      },
      signal: config.signal,
      ...config,
    });

    if (!req.ok) {
      const resbody = await req.text();
      throw ApiErrorFactory(req.status, resbody);
    }
    const result = await req.json();

    return { data: result, headers: req.headers, statusCode: req.status };
  } catch (e: any) {
    // if (e instanceof ApiError) {
    //   console.error(`API Error: ${e.message} (status code: ${e.statusCode})`);
    // } else {
    //   console.error(`Unexpected Error: ${e.message}`);
    // }
    const a = 2;
    console.log(a);

    throw e;
  }
};

export default baseRequest;
