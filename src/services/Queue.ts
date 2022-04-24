import Bull, { JobId, QueueOptions } from 'bull';
import axios from 'axios';
import QueueLogger from './QueueLogger.service';
import jobDatabase from '../database/job.database';

class Queue extends Bull {
  logger: QueueLogger;

  constructor(queueName: string, opts: QueueOptions | undefined) {
    super(queueName, opts);
    this.logger = new QueueLogger(this.name);
  }

  log(data) {
    this.logger.log(data);
  }

  listener() {
    // Listeners
    this
      // When queue error
      .on('global:error', (err) => {
        this.logger.global().error(err);
      })

      // When queue on progress change
      .on('global:progress', async (jobId: JobId, progress) => {
        const job = await this.getJob(jobId);
        if (job) {
          this.logger.global().progress(jobId.toString(), job.name, progress);
          jobDatabase.update(jobId.toString(), {
            progress,
          });
        }
      })

      // When queue failed
      .on('global:failed', async (jobId: JobId, err: Error) => {
        const job = await this.getJob(jobId);
        if (job) {
          this.logger.global().failed(jobId.toString(), job.name, err);
          const { data } = job;
          const { callbackApi } = data;
          if (callbackApi) {
            await axios({
              url: callbackApi,
              method: 'POST',
              data: {
                ...data,
                errMessage: err.message,
                status: 'failed',
              },
            })
              .then((res) => res.data)
              .catch((error) => {
                console.error(error.data);
              });
          }
          jobDatabase.update(jobId.toString(), {
            status: 'failed',
          });
        }
      })

      // When queue completed
      .on('global:completed', async (jobId: JobId, jobResult) => {
        const job = await this.getJob(jobId);
        if (job) {
          this.logger.global().completed(jobId.toString(), job.name, jobResult);
          const { success, result } = JSON.parse(jobResult);
          const { callbackApi } = result;
          if (callbackApi) {
            await axios({
              url: callbackApi,
              method: 'POST',
              data: {
                ...JSON.parse(jobResult).result,
                status: 'completed',
              },
            })
              .then((res) => res.data)
              .catch((err) => {
                console.error(err.data);
              });
          }
          jobDatabase.update(jobId.toString(), {
            status: 'completed',
          });
        }
      })
      .on('global:waiting', async (jobId: JobId, progress) => {
        const job = await this.getJob(jobId);
        if (job) {
          this.logger.global().progress(jobId.toString(), job.name, progress);
        }
        jobDatabase.update(jobId.toString(), {
          progress,
          status: 'waiting',
        });
      })
      // .on('global:paused', async (jobId: JobId, progress) => {
      //   this.logger.global().progress(jobId, progress);
      //   await QueueLog.findOneAndUpdate(
      //     { jobId: jobId.toString() },
      //     { jobState: 'paused' },
      //   );
      // })

      .on('global:removed', async (jobId: JobId) => {
        const job = await this.getJob(jobId);
        if (job) {
          this.logger.global().removed(jobId.toString(), job.name);
        }
        jobDatabase.update(jobId.toString(), {
          status: 'removed',
        });
        // await QueueLog.findOneAndUpdate(
        //   { jobId: jobId.toString() },
        //   { jobState: 'removed' },
        // );
      });
    // .on('global:cleaned', async (jobId: JobId, progress) => {
    //   this.logger.global().progress(jobId, progress);
    //   // await QueueLog.findOneAndUpdate(
    //   //   { jobId: jobId.toString() },
    //   //   { jobState: 'cleaned' },
    //   // );
    // });
    // .on('global:resumed', async (jobId: JobId, progress) => {
    //   this.logger.global().progress(jobId, progress);
    //   await QueueLog.findOneAndUpdate(
    //     { jobId: jobId.toString() },
    //     { jobState: 'resumed' },
    //   );
    // });
  }
}

export default Queue;
