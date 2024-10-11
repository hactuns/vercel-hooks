import { MongoClient } from 'mongodb';
import { Mongo } from './mongo.js';

export type ApiResponse<T = Response> = T | Response | undefined;
export type ApiRequest<T = Request> = T | Request | undefined;

const withMongo =
  <REQ = ApiRequest, RES = ApiResponse>(
    callback: (
      req: ApiRequest | REQ,
      res: ApiResponse | RES,
      db: MongoClient
    ) => Promise<ApiResponse | RES> | ApiResponse | RES
  ) =>
  async (req: ApiRequest | REQ, res: ApiResponse | RES): Promise<ApiResponse | RES> => {
    try {
      const client = await Mongo.getClient().connect();

      console.log('[MONGO_INSTANCE]: connected');

      return callback(req, res, client);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Can not connect to mongo instance' }), {
        status: 400,
      });
    }
  };

export default withMongo;
