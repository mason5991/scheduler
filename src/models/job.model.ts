import mongoose, { Schema, Aggregate, Query, Document } from 'mongoose';
import { JobModel } from '../interfaces/job.interface';
import { getNextSequenceValue } from './counter.model';
import { premise, transform, toObjectTransform } from '../database';

const JobSchema: Schema = new Schema(
  {
    jobId: { type: String, require: true },
    name: { type: String, require: true },
    data: {
      refId: {
        type: String,
      },
      datasetRefId: {
        type: String,
      },
      data: {
        type: Schema.Types.Mixed,
      },
      callbackApi: {
        type: String,
      },
      setting: {
        type: Object,
      },
    },
    opts: { type: Object },
    progress: { type: Number },
    status: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

JobSchema.set('toObject', { transform: toObjectTransform });

JobSchema.pre<JobModel & Document>('save', async function (next) {
  if (this.isNew) {
    this.jobId = await getNextSequenceValue('JOB_');
  }

  next();
});

JobSchema.post<JobModel & Document>('save', async function () {
  console.log(this);
});

JobSchema.pre<Aggregate<JobModel & Document>>('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

JobSchema.pre<Query<JobModel, JobModel & Document>>(
  'find',
  async function (next) {
    premise(this);
    transform(this);
    next();
  },
);

JobSchema.pre<Query<JobModel, JobModel & Document>>(
  'findOne',
  async function (next) {
    premise(this);
    transform(this);
    next();
  },
);

JobSchema.pre<Query<JobModel, JobModel & Document>>(
  'findOneAndUpdate',
  async function (next) {
    premise(this);
    transform(this);
    next();
  },
);

export const collectionName = 'jobs';

export const Job = mongoose.model<JobModel & Document>(
  collectionName,
  JobSchema,
);

export default Job;
