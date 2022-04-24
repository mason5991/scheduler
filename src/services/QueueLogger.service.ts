import { existsSync, mkdirSync } from 'fs';
import { appendFile } from 'fs/promises';
import { QueueJson } from '../interfaces/queue.interface';
import { printDebug } from '../utils/log';

export interface GlobalLogger {
  error: (err: Error) => Promise<void>;
  completed: (jobId: string, jobName: string, result: any) => Promise<void>;
  failed: (jobId: string, jobName: string, err: Error) => Promise<void>;
  progress: (jobId: string, jobName: string, progress: number) => Promise<void>;
  removed: (jobId: string, jobName: string) => Promise<void>;
  // cleaned: (jobId: string, jobName: string) => Promise<void>;
}
class QueueLogger {
  logDirectory: string;

  queueName: string;

  constructor(queueName: string) {
    this.logDirectory = 'logs/';
    this.queueName = queueName;

    if (!existsSync(this.logDirectory)) {
      mkdirSync(this.logDirectory);
    }
  }

  private async writeLog(logType: string, data: string) {
    const current = new Date();
    const fileName = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}.log`;
    const filePath = `${this.logDirectory}${fileName}`;
    const writeData = `[${logType}][${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}.${current.getMilliseconds()}][${
      this.queueName
    }]${data}`;
    if (process.env.QUEUE_LOG === 'debug') {
      printDebug(writeData);
    }
    return appendFile(filePath, `${writeData}\n`);
  }

  async log(data: string): Promise<void> {
    return this.writeLog('log', data);
  }

  async error(err: Error): Promise<void> {
    const logData = `${err.name} ${err.message} ${err.stack}`;
    return this.writeLog('error', logData);
  }

  async completed(
    jobId: string,
    jobName: string,
    jobData: QueueJson,
    result: string = '',
  ): Promise<void> {
    const { data, returnvalue, ...log } = jobData;
    const logData = `[${jobId}][${jobName}]${JSON.stringify(log)}`;

    return this.writeLog('completed', logData);
  }

  async failed(
    jobId: string,
    jobName: string,
    err: Error,
    jobData: QueueJson,
  ): Promise<void> {
    const { data, returnvalue, ...log } = jobData;
    const logData = `[${jobId}][${jobName}]${err.message} ${JSON.stringify(
      log,
    )}`;

    return this.writeLog('failed', logData);
  }

  async removed(jobId: string, jobName: string): Promise<void> {
    const logData = `[${jobId}][${jobName}]`;

    return this.writeLog('removed', logData);
  }

  async progress(
    jobId: string,
    jobName: string,
    progress: any = '',
  ): Promise<void> {
    const logData = `[${jobId}][${jobName}]Progress:${progress}`;
    return this.writeLog('progress', logData);
  }

  global(): GlobalLogger {
    return {
      error: async (err) => {
        const logData = `${err.name} ${err.message} ${err.stack}`;
        return this.writeLog('global:error', logData);
      },

      completed: async (jobId, jobName, result) => {
        const logData = `[${jobId}][${jobName}]`;
        return this.writeLog('global:completed', logData);
      },

      failed: async (jobId, jobName, err) => {
        const logData = `[${jobId}][${jobName}]${err.message}`;
        return this.writeLog('global:failed', logData);
      },

      progress: async (jobId, jobName, progress = 0) => {
        const logData = `[${jobId}][${jobName}]Progress:${progress}`;
        return this.writeLog('global:progress', logData);
      },

      removed: async (jobId, jobName) => {
        const logData = `[${jobId}][${jobName}]`;
        return this.writeLog('global:removed', logData);
      },
    };
  }
}

export default QueueLogger;
