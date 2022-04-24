import { Request, Response, NextFunction } from 'express';
import { getAllJobType } from '../utils/queue.util';

const jobMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobType } = req.params;
    if (!jobType || !getAllJobType().includes(jobType)) {
      throw new Error('UnknownJob');
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default jobMiddleware;
