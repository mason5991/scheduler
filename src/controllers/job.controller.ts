import Bull from 'bull';
import { Request, Response, NextFunction } from 'express';

import { QueueDataset } from '../interfaces/queue.interface';
import job from '../handlers/job.handler';

// Add new jobs to queue
const addJobs = async (req: Request, res: Response, next: NextFunction) => {
  const { jobType } = req.params;
  const {
    refId,
    datasets = [],
    opts = {},
    callbackApi,
  } = req.body as {
    refId: string;
    datasets: QueueDataset[];
    opts: Bull.JobOptions;
    callbackApi: string;
  };

  try {
    // Producer to add job to queue
    const jobResults = await job.addBulk(
      jobType,
      refId,
      datasets,
      opts,
      callbackApi,
    );

    res.status(200).json({
      success: true,
      message: 'Success.',
      result: {
        jobs: jobResults,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get job list
const getJobs = async (req: Request, res: Response, next: NextFunction) => {};

export default {
  addJobs,
  getJobs,
};
