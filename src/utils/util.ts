import md5 from 'md5';
import { customAlphabet } from 'nanoid';

export const getEnv = (key: string): string | undefined => process.env[key];

export const randomId = (
  prepend: string = '',
  alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  size: number = 8,
) => {
  const id = customAlphabet(alphabet, size)();
  return `${prepend || ''}${id}`;
};

export default {
  randomId,
};
