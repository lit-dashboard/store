import { camelCase } from 'lodash';

export const normalizeKey = (key) => {
  return key
    .split('/')
    .map(keyPart => camelCase(keyPart))
    .join('/');
};