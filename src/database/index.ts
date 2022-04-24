import mongoose, { Query } from 'mongoose';
import { getEnv } from '../utils/util';
import { printError, printInfo } from '../utils/log';

export const projectionFields = {
  _id: 0,
  __v: 0,
  isDeleted: 0,
};

export const connect = async () => {
  const username = getEnv('MONGODB_USERNAME');
  const password = getEnv('MONGODB_PASSWORD');
  const host = getEnv('MONGODB_HOST');
  const port = getEnv('MONGODB_PORT');
  const db = getEnv('MONGODB_DATABASE');
  const uri = `mongodb://${username}:${password}@${host}:${port}/${db}`;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: false,
  };
  printInfo(`[${host}:${port}][${db}] Connecting database...`);
  try {
    await mongoose.connect(uri, options);
    printInfo(`[${db}] Database connected`);
    return true;
  } catch (err) {
    printError(`[${db}] Error on connecting database`);
    return process.exit(1);
  }
};

export function premise(query: Query<any, any>) {
  query.where({ isDeleted: false });
}

export function transform(query: Query<any, any>) {
  query.select(projectionFields);
}

export function toObjectTransform(doc, ret, options) {
  const returnRet = { ...ret };
  Object.keys(projectionFields).forEach((field) => {
    if (projectionFields[field] === 0) {
      delete returnRet[field];
    }
  });
  return returnRet;
}

export default {
  connect,
  premise,
  transform,
  toObjectTransform,
};
