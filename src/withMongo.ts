import { MongoClient } from 'mongodb';
import { MongoDB } from './mongo.js';

export type ApiResponse<T = Response> = T | Response | undefined;
export type ApiRequest<T = Request> = T | Request | undefined;

const withMongo =
  (
    callback: (
      req: ApiRequest,
      res: ApiResponse,
      db: MongoClient
    ) => Promise<ApiResponse> | ApiResponse
  ) =>
  async (req: ApiRequest, res: ApiResponse): Promise<ApiResponse> => {
    try {
      const client = await MongoDB.getClient().connect();

      console.log('[MONGO_INSTANCE]: connected');

      return callback(req, res, client);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Can not connect to mongo instance' }), {
        status: 400,
      });
    }
  };

export default withMongo;
