import { connect } from "mongoose";
import { ENV } from "./env";

let cache = globalThis.mongoose;

if (!cache) {
  cache = globalThis.mongoose = { conn: null, promise: null };
}

export const db_connection = async () => {
  // if there is alredy conn present then returen that conn
  if (cache.conn) return cache.conn;
  // if there isn't present any conn promise then create new
  if (!cache.promise) cache.promise = connect(ENV.MONGODB_URI).then((m) => m.connection);

  try {
    // build new conn
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
};
