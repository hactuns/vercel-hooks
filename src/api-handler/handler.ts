import { waitUntil } from '@vercel/functions';
import type { HandlerCallback, HandlerFunction, HttpMethod } from './type.js';
import Logger from '../logger/logger.js';
import debounce from '../utils/debounce.js';
import crypto from 'crypto';

const voidFnc = () => undefined;
const FNC_TIME_OUT = Number(process.env.FNC_TIME_OUT || 2_000);

export const handler =
  <Method extends HttpMethod, HandlerType extends Record<Method, HandlerFunction<Method>[Method]>>(
    callback: HandlerCallback<HandlerType>
  ) =>
  (req: HandlerType[Method]['req'], res: HandlerType[Method]['res']) => {
    Logger.defaultMeta ??= {};
    Logger.defaultMeta.traceId = crypto.randomUUID();
    Logger.debug(`[FNC_INVOKED] at ${new Date().toISOString()}`);

    const method = req.method?.toUpperCase() as keyof typeof callback;

    if (typeof callback[method] !== 'function') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const maybePromise = callback[method](req, res, {}) as Promise<unknown>;

    if (maybePromise instanceof Promise) {
      return maybePromise.then((result) => {
        waitUntil(debounce(voidFnc, FNC_TIME_OUT));

        return result;
      });
    }

    waitUntil(debounce(voidFnc, FNC_TIME_OUT));

    return maybePromise;
  };

export default handler;
