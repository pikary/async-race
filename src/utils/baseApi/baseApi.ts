import { ApiErrorFactory } from './types';

const API_URL = 'http://127.0.0.1:3000';

interface Config {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  [key: string]: any;
}
interface ApiResponse<ReturnType> {
  data: ReturnType;
  headers: Headers;
  statusCode: number;
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
    console.error(e);
    throw e;
  }
};

export default baseRequest;
