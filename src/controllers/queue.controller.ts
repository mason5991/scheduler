import { Request, Response, NextFunction } from 'express';
import { getRedisConfig } from '../utils/queue.util';
import Queue from '../services/Queue';

// Get queue
const getQueue = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const { queueName } = req.params;

  try {
    const q = new Queue(queueName, {
      redis: getRedisConfig(queueName),
    });
    const qJobs = await q.getJobs(status);
    res.status(200).json({
      success: true,
      message: 'Success.',
      result: {
        queues: qJobs,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getQueue,
};
