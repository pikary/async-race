const API_URL = 'http://127.0.0.1:3000';

interface Config {
  headers?: Record<string, string>;
  [key: string]: any;
}
interface ApiResponse<ReturnType>{
  data:ReturnType,
  headers:Headers
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
      ...config,
    });

    const result = await req.json();

    if (!req.ok) {
      if (req.status === 404) throw new Error('Not found');
      throw result.message;
    }
    console.log({ data: result, headers: req.headers });

    return { data: result, headers: req.headers };
  } catch (e: any) {
    throw new Error(e);
  }
};

export default baseRequest;
