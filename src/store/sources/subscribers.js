import { normalizeKey } from '../../util';
import { getRawSource, getSources, getSource } from './sources';


class Subscribers {

  constructor() {
    this.nextSubscriberId = 0;
    this.subscribers = {};
    this.subscribersAll = {};
  }

  subscribe(providerName, key, callback, callImmediately) {
    if (typeof callback !== 'function') {
      throw new Error('Callback is not a function');
    }
  
    const normalizedKey = normalizeKey(key);
  
    if (this.subscribers[providerName] === undefined) {
      this.subscribers[providerName] = {};
    }
  
    if (this.subscribers[providerName][normalizedKey] === undefined) {
      this.subscribers[providerName][normalizedKey] = {};
    }
  
    const id = this.nextSubscriberId;
    this.nextSubscriberId++;
    this.subscribers[providerName][normalizedKey][id] = callback;
  
    if (callImmediately) {
      const source = getSource(providerName, normalizeKey(key));
      if (source !== undefined) {
        callback(source, key, key);
      }
    }
  
    const unsubscribe = () => {
      delete this.subscribers[providerName][normalizedKey][id];
    };
  
    return unsubscribe;
  }

  subscribeAll(providerName, callback, callImmediately) {
    if (typeof callback !== 'function') {
      throw new Error('Callback is not a function');
    }
  
    if (this.subscribersAll[providerName] === undefined) {
      this.subscribersAll[providerName] = {};
    }
  
    const id = this.nextSubscriberId;
    this.nextSubscriberId++;
    this.subscribersAll[providerName][id] = callback;
  
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
      delete this.subscribersAll[providerName][id];
    };
  
    return unsubscribe;
  }

  notifySubscribers(providerName, key) {
    const keyParts = normalizeKey(key).split('/');
    if (providerName in this.subscribers) {
      keyParts.forEach((keyPart, index) => {
        const sourceKey = keyParts.slice(0, index + 1).join('/');
        for (let id in this.subscribers[providerName][sourceKey] || {}) {
          const subscriber = this.subscribers[providerName][sourceKey][id];
          const source = getSource(providerName, sourceKey);
          subscriber(source, sourceKey, normalizeKey(key));
        }
      });
    }
  
    if (providerName in this.subscribersAll) {
      for (let id in this.subscribersAll[providerName]) {
        const subscriber = this.subscribersAll[providerName][id];
        const source = getSource(providerName, key);
        subscriber(source, normalizeKey(key));
      }
    }
  }

  notifySubscribersRemoved(providerName, keys, keysFomProviders) {
    if (providerName in this.subscribers) {
      for (let key of keys) {
        key = normalizeKey(key);
        for (let id in this.subscribers[providerName][key]) {
          const subscriber = this.subscribers[providerName][key][id];
          subscriber(undefined, key, key);
        }
      }
    }
  
    if (providerName in this.subscribersAll) {
      for (let key of keysFomProviders || keys) {
        for (let id in this.subscribersAll[providerName]) {
          const subscriber = this.subscribersAll[providerName][id];
          subscriber(undefined, key);
        }
      }
    }
  }
}

const subscribers = new Subscribers();

export const subscribe = (providerName, key, callback, callImmediately) => {
 return subscribers.subscribe(providerName, key, callback, callImmediately);
};

export const subscribeAll = (providerName, callback, callImmediately) => {
  return subscribers.subscribeAll(providerName, callback, callImmediately);
};

export const notifySubscribers = (providerName, key) => {
  subscribers.notifySubscribers(providerName, key);
};

export const notifySubscribersRemoved = (providerName, keys, keysFomProviders) => {
  subscribers.notifySubscribersRemoved(providerName, keys, keysFomProviders);
};