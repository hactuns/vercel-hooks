import { Collection, MongoClient } from 'mongodb';

export class Mongo {
  private static client: MongoClient;

  static getClient() {
    if (!this.client) {
      this.client = new MongoClient(String(process.env.MONGODB_URI));
    }

    return this;
  }

  static async connect() {
    try {
      const client = await this.client.connect();
      console.log('[MONGO_INSTANCE]: connected');

      return client;
    } catch (error) {
      console.error('[MONGO_INSTANCE]: connection error', error);
      throw new Error('Cannot connect to mongodb');
    }
  }

  private static getDB() {
    const databaseName = process.env.MONGODB_DATABASE;

    if (!databaseName) {
      throw new Error('Mongo Database not provided');
    }

    const db = this.client.db(String(databaseName));

    return db;
  }

  static collection<T extends object = object>(collection: string) {
    return this.getDB().collection<T>(collection);
  }
}
