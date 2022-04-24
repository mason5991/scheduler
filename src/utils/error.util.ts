export const parseError = (err) => {
  if (err.message.match(/^ServiceError: +([\w\d\s]+)*$/)) {
    return err;
  }
  return false;
};

export const getErrorCode = (err) =>
  err.message.replace('ServiceError: ', '') as string;

export default {
  parseError,
  getErrorCode,
};
