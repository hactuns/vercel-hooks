import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Request, Response } from 'express';
import Logger from '../logger/logger.js';

export interface RequestContext<
  Req extends Request | VercelRequest = Request,
  Res extends Response | VercelResponse = Response,
> {
  req: Req;
  res: Res;
}

export type APIHandler<RC extends RequestContext = RequestContext, Context = object> = (
  req: RC['req'],
  res: RC['res'],
  context: Context
) => Promise<RC['res']> | RC['res'];

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type HandlerFunction<
  Key extends HttpMethod,
  Req extends Request | VercelRequest = Request,
  Res extends Response | VercelResponse = Response,
> = Record<Key, RequestContext<Req, Res>>;

type HandlerCallback<RC extends Record<string, RequestContext>> = {
  [Method in keyof RC]?: APIHandler<RC[Method], object>;
};

export const handler =
  <Method extends HttpMethod, HandlerType extends Record<Method, HandlerFunction<Method>[Method]>>(
    callback: HandlerCallback<HandlerType>
  ) =>
  (req: HandlerType[Method]['req'], res: HandlerType[Method]['res']) => {
    Logger.info(`Method invoked at ${new Date().toISOString()}`);
    const method = req.method?.toUpperCase() as keyof typeof callback;

    if (typeof callback[method] !== 'function') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    return callback[method](req, res, {});
  };

export default handler;
