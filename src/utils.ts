import isObject from 'lodash/isObject';

const isPlainObject = (obj: unknown): obj is Record<string, string> => {
  return isObject(obj);
};

export { isPlainObject };
