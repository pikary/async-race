const API_URL = 'http://127.0.0.1:3000';

interface Config {
  headers?: Record<string, string>;
  [key: string]: any;
}

const baseRequest = async <ReturnType>(
  method: string,
  url: string,
  body: any = null,
  config: Config = {},
): Promise<ReturnType | undefined> => {
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
      throw result.message;
    }
    return result as ReturnType;
  } catch (e: any) {
    throw new Error(e);
  }
};

export default baseRequest;
