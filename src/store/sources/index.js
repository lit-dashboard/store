

import Sources from './sources';

const sourcesObject = new Sources();

export const getRawSources = (providerName) => {
  return sourcesObject.getRawSources(providerName);
};

export const getRawSource = (providerName, key) => {
  return sourcesObject.getRawSource(providerName, key);
}

export const getSources = (providerName) => {
  return sourcesObject.getSources(providerName);
};

export const getSource = (providerName, key) => {
  return sourcesObject.getSource(providerName, key);
};

export const clearSources = (providerName) => {
  return sourcesObject.clearSources(providerName);
};

export const removeSources = (providerName) => {
  return sourcesObject.removeSources(providerName);
};

export const sourcesRemoved = (providerName, sourceRemovals) => {
  sourcesObject.sourcesRemoved(providerName, sourceRemovals);
};

export const sourcesChanged = (providerName, sourceChanges) => {
  sourcesObject.sourcesChanged(providerName, sourceChanges);
};

export const subscribe = (providerName, key, callback, callImmediately) => {
  return sourcesObject.subscribe(providerName, key, callback, callImmediately);
};

export const subscribeAll = (providerName, callback, callImmediately) => {
  return sourcesObject.subscribeAll(providerName, callback, callImmediately);
};
