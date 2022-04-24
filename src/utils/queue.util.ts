import fs from 'fs';
import path from 'path';
import Queue from '../services/Queue';

export const getQueueAllConfig = () => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/../../configs/queue.json`,
      'utf8',
    );
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const getQueues = () => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/../../configs/queue.json`,
      'utf8',
    );
    const { queues: qs } = JSON.parse(data);
    return qs;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getAllJobType = () => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/../../configs/queue.json`,
      'utf8',
    );
    const { queues: qs } = JSON.parse(data);
    let jobTypes: string[] = [];
    Object.keys(qs).forEach((key) => {
      jobTypes = [...jobTypes, ...Object.keys(qs[key].jobs)];
    });
    return jobTypes;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getAllJobTypeConfig = () => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/../../configs/queue.json`,
      'utf8',
    );
    const { queues: qs } = JSON.parse(data);
    const jobTypes: { [key: string]: any } = {};
    Object.keys(qs).forEach((key) => {
      const { jobs } = qs[key];
      Object.keys(jobs).forEach((jobType) => {
        jobTypes[jobType] = jobs[jobType];
      });
    });
    return jobTypes;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getQueueJobTypes = (queueName: string) => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/../../configs/queue.json`,
      'utf8',
    );
    const { queues: qs } = JSON.parse(data);
    return Object.keys(qs[queueName].jobs);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getQueueConfig = (queueName: string) => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/../../configs/queue.json`,
      'utf8',
    );
    const { queues: qs } = JSON.parse(data);
    if (!qs || !qs[queueName]) {
      return {};
    }
    return { ...qs[queueName], name: queueName };
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const initQueue = (name, config, opts) => {
  const queue = new Queue(name, opts);
  const { jobs } = config;
  const jobQueue: { [key: string]: Queue } = {};
  if (jobs) {
    queue.log(`Initializing queue ${name}, opts: ${JSON.stringify(opts)}`);
    queue.log(`Jobs support: ${Object.keys(jobs).join(', ')}`);
    queue.listener();
    Object.keys(jobs).forEach((key) => {
      jobQueue[key] = queue;
    });
  }
  return jobQueue;
};

export const initQueues = (queueConfig) => {
  const { queues, redis: globalRedis } = queueConfig;
  if (queues) {
    let allQueues: { [key: string]: Queue } = {};
    Object.keys(queues).forEach((name) => {
      const { opts, redis, ...args } = queues[name];
      const queue = initQueue(name, args, { redis: redis || globalRedis });
      allQueues = { ...allQueues, ...queue };
    });
    return allQueues;
  }
  return {};
};

export const getRedisConfig = (queueName: string) => {
  try {
    const { queues, redis } = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../configs/queue.json'),
        'utf8',
      ),
    );
    if (queueName && queues[queueName] && queues[queueName].redis) {
      return queues[queueName].redis;
    }
    if (redis) {
      return redis;
    }
    return {};
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default {
  getQueueAllConfig,
  getQueues,
  getAllJobType,
  getAllJobTypeConfig,
  getQueueJobTypes,
  getQueueConfig,
  initQueue,
  initQueues,
  getRedisConfig,
};
