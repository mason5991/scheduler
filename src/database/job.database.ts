import { JobOptions } from 'bull';
import { JobModelData } from '../interfaces/job.interface';
import Job from '../models/job.model';

const addBulk = async (
  data: {
    name: string;
    data: {
      refId: string;
      datasetRefId: string;
      data: any;
      callbackApi: string | undefined;
      setting: {
        [key: string]: any;
      };
    };
    opts: JobOptions;
  }[],
): Promise<JobModelData[]> => {
  const docs = await Job.create(data.map((d) => ({ ...d, status: 'added' })));
  return docs.map((doc) => doc.toObject());
};

const update = async (jobId, data) =>
  Job.findOneAndUpdate({ jobId }, data, { upsert: true }).exec();

export default {
  addBulk,
  update,
};
