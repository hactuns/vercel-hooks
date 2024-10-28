import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Request, Response } from 'express';

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

export type HandlerCallback<RC extends Record<string, RequestContext>> = {
  [Method in keyof RC]?: APIHandler<RC[Method], object>;
};
