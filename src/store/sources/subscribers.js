import { normalizeKey } from '../../util';
import { getRawSource } from './sources';

let nextSubscriberId = 0;
const subscribers = {};
const subscribersAll = {};

export const addSubscriber = (providerName, key, callback, callImmediately, getSource) => {
  if (typeof callback !== 'function') {
    throw new Error('Callback is not a function');
  }

  const normalizedKey = normalizeKey(key);

  if (subscribers[providerName] === undefined) {
    subscribers[providerName] = {};
  }

  if (subscribers[providerName][normalizedKey] === undefined) {
    subscribers[providerName][normalizedKey] = {};
  }

  const id = nextSubscriberId;
  nextSubscriberId++;
  subscribers[providerName][normalizedKey][id] = callback;

  if (callImmediately) {
    const source = getSource(providerName, normalizeKey(key));
    if (source !== undefined) {
      callback(source, key, key);
    }
  }

  const unsubscribe = () => {
    delete subscribers[providerName][normalizedKey][id];
  };

  return unsubscribe;
};

export const addSubscriberAll = (providerName, callback, callImmediately, getSources) => {
  if (typeof callback !== 'function') {
    throw new Error('Callback is not a function');
  }

  if (subscribersAll[providerName] === undefined) {
    subscribersAll[providerName] = {};
  }

  const id = nextSubscriberId;
  nextSubscriberId++;
  subscribersAll[providerName][id] = callback;

  if (callImmediately) {
    const sources = getSources(providerName);
    Object.getOwnPropertyNames(sources || {}).forEach(key => {
      const rawSource = getRawSource(providerName, key);
      if (rawSource.__fromProvider__) {
        const source = sources[key];
        callback(source, key);
      }
    });
  }

  const unsubscribe = () => {
    delete subscribersAll[providerName][id];
  };

  return unsubscribe;
};

export const notifySubscribers = (providerName, key, getSource) => {
  const keyParts = normalizeKey(key).split('/');
  if (providerName in subscribers) {
    keyParts.forEach((keyPart, index) => {
      const sourceKey = keyParts.slice(0, index + 1).join('/');
      for (let id in subscribers[providerName][sourceKey] || {}) {
        const subscriber = subscribers[providerName][sourceKey][id];
        const source = getSource(providerName, sourceKey);
        subscriber(source, sourceKey, normalizeKey(key));
      }
    });
  }

  if (providerName in subscribersAll) {
    for (let id in subscribersAll[providerName]) {
      const subscriber = subscribersAll[providerName][id];
      const source = getSource(providerName, key);
      subscriber(source, normalizeKey(key));
    }
  }
};

export const notifySubscribersRemoved = (providerName, keys, keysFomProviders) => {
  if (providerName in subscribers) {
    for (let key of keys) {
      key = normalizeKey(key);
      for (let id in subscribers[providerName][key]) {
        const subscriber = subscribers[providerName][key][id];
        subscriber(undefined, key, key);
      }
    }
  }

  if (providerName in subscribersAll) {
    for (let key of keysFomProviders || keys) {
      for (let id in subscribersAll[providerName]) {
        const subscriber = subscribersAll[providerName][id];
        subscriber(undefined, key);
      }
    }
  }
};