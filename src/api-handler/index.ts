import type { VercelRequest, VercelResponse } from '@vercel/node';

export type APIHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<VercelResponse> | VercelResponse;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const handler =
  (callback: Partial<Record<HttpMethod, APIHandler>>) =>
  (req: VercelRequest, res: VercelResponse) => {
    const method = req.method?.toUpperCase() as HttpMethod;

    if (typeof callback[method] !== 'function') {
      return res.json({ message: 'Method not found' });
    }

    return callback[method](req, res);
  };

export default handler;
