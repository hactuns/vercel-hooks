import withMongo from './hook.js';

export type * from 'mongodb';
export { Mongo } from './client.js';
export { withMongo };
export default withMongo;
