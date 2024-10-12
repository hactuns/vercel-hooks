import { MongoClient } from 'mongodb';
import { Mongo } from './mongoClient.js';
import type { Response, Request } from 'express';
import type { APIHandler, RequestContext } from '../api-handler/index.js';

export const withMongo =
  <Req extends Request = Request, Res extends Response = Response, Context extends object = object>(
    callback: APIHandler<RequestContext<Req, Res>, Record<'client', MongoClient> & Context>
  ): APIHandler<RequestContext<Req, Res>, Context> =>
  async (req, res, context) => {
    try {
      const client = await Mongo.getClient().connect();

      return callback(req, res, { ...context, client });
    } catch (error) {
      return res.json({ message: 'Can not connect to mongo instance' });
    }
  };

export default withMongo;
