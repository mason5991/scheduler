import { JobOptions } from 'bull';
import { DbDocument, DbDocumentMetaData } from './common.interface';

export interface JobModelData {
  jobId: string;
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
  progress: number;
  status: string;
}

export interface JobModel
  extends DbDocument,
    DbDocumentMetaData,
    JobModelData {}
