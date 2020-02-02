import { camelCase } from 'lodash';
export var normalizeKey = key => {
  return key.split('/').map(keyPart => camelCase(keyPart)).join('/');
};