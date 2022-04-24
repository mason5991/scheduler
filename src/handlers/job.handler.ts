import { JobOptions } from 'bull';
import { QueueDataset } from '../interfaces/queue.interface';
import producer from '../producers';
import jobDatabase from '../database/job.database';
import { parseError } from '../utils/error.util';

export const addBulk = async (
  jobType: string,
  refId: string,
  datasets: QueueDataset[],
  opts: JobOptions,
  callbackApi?: string,
) => {
  const jobResults = await producer.add(
    jobType,
    refId,
    datasets,
    opts,
    callbackApi,
  );
  if (!jobResults) {
    throw new Error('FailToAddJob');
  }
  return jobResults;
};

export const update = async (jobId: string, data) => {
  try {
    await jobDatabase.update(jobId, data);
  } catch (err) {
    if (parseError(err)) {
      throw err;
    }
    throw new Error('ServiceError: FailToUpdateJob');
  }
};

export default {
  addBulk,
  update,
};
