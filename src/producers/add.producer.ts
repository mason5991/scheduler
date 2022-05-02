import { JobOptions } from 'bull';
import { getQueueAllConfig, getAllJobTypeConfig } from '../utils/queue.util';
import queue from '../queue';
import { QueueDataset } from '../interfaces/queue.interface';
import { printInfo } from '../utils/log';
import jobDatabase from '../database/job.database';

export const add = async (
  jobType: string,
  refId: string,
  datasets: QueueDataset[],
  opts: JobOptions,
  callbackApi?: string,
) => {
  // Define job option
  const config = getQueueAllConfig();
  const jobConfig = getAllJobTypeConfig();

  if (datasets.length === 0) {
    throw new Error('NoDatasetProvided');
  }

  // Create jobs
  const jobs = datasets.map((dataset) => {
    const { datasetRefId, data, ...setting } = dataset;
    printInfo(`[${jobType}][${refId}][${datasetRefId}] Adding new job`);
    const jobOpts = {
      ...opts,
      removeOnComplete:
        jobConfig[jobType].opts.removeOnComplete ||
        config.opts.removeOnComplete ||
        100,
      removeOnFail:
        jobConfig[jobType].opts.removeOnFail || config.opts.removeOnFail || 100,
    };
    return {
      name: jobType,
      data: {
        refId,
        datasetRefId,
        data,
        callbackApi,
        setting,
      },
      opts: jobOpts,
    };
  });

  // Add jobs
  const addedJobs = await jobDatabase.addBulk(jobs);
  const promises = queue[jobType].addBulk(
    addedJobs.map((job) => ({
      name: job.name,
      data: job.data,
      opts: {
        ...job.opts,
        jobId: job.jobId,
      },
    })),
  );
  return promises.then((results) => results);
};

export default add;
