import Logger from '../logger/logger.js';
import type { HandlerCallback, HandlerFunction, HttpMethod } from './type.js';

export const handler =
  <Method extends HttpMethod, HandlerType extends Record<Method, HandlerFunction<Method>[Method]>>(
    callback: HandlerCallback<HandlerType>
  ) =>
  (req: HandlerType[Method]['req'], res: HandlerType[Method]['res']) => {
    Logger.debug(`[FNC_INVOKED] At ${new Date().toISOString()}`);
    const method = req.method?.toUpperCase() as keyof typeof callback;

    if (typeof callback[method] !== 'function') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    return callback[method](req, res, {});
  };

export default handler;
