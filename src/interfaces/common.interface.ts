export interface File {
  fileName: string;
  uploadTime: Date;
  fileExtension: string;
  filePath: string;
  host: string;
  fileDirectory: string;
  type: string;
}

export interface DbDocument {
  createdAt: Date;
  updatedAt: Date;
}

export interface DbDocumentMetaData {
  isDeleted: boolean;
}
