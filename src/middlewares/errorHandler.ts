import { Request, Response, NextFunction } from 'express';
import { printError } from '../utils/log';
import errCode from '../def/errCode.json';

interface IErrCode {
  [key: string]: {
    code: number;
    message: string;
  };
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err) {
    next();
  }

  const errMap: IErrCode = errCode;

  if (errMap[err.message]) {
    const { code, message } = errMap[err.message];
    return res
      .status(code)
      .json({ success: false, errCode: err.message, message });
  }
  printError(err);
  return res.status(500).json({
    success: false,
    errCode: 'ServerError',
    message: 'Server Error.',
  });
};

export default errorHandler;
