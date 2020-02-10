import { normalizeKey } from '../util';
import { getSourceProvider } from './index';

const rawSources = {};
const sources = {};

const subscribers = {};
let nextSubscriberId = 0;

const createRawSource = () => {
  return {
    __normalizedKey__: undefined,
    __fromProvider__: false,
    __key__: undefined,
    __value__: undefined,
    __sources__: {}
  };
};

const createSource = () => {
  return {
    getters: {},
    setters: {},
    sources: {}
  };
};

const noopSourceSetters = (providerName) => {
  if (typeof sources[providerName] === 'undefined') {
    return;
  }

  for (let key in sources[providerName].setters) {
    sources[providerName].setters[key] = () => {};
  }
};

const notifySubscribers = () => {
  for (let id in subscribers) {
    const subscriber = subscribers[id];
    subscriber();
  }
};

export const getRawSources = (providerName) => {
  return rawSources[providerName];
};

export const getRawSource = (providerName, key) => {
  let sourcesRoot = getRawSources(providerName);

  if (typeof sourcesRoot === 'undefined') {
    return null;
  }

  if (typeof key !== 'string') {
    return sourcesRoot;
  }

  const keyParts = normalizeKey(key).split('/');

  let sources = sourcesRoot.__sources__;

  for (let index in keyParts) {
    const keyPart = keyParts[index];

    if (keyParts.length - 1 === parseInt(index)) {
      return (keyPart in sources) ? sources[keyPart] : null;
    }

    if (keyPart in sources) {
      sources = sources[keyPart].__sources__;
    } else {
      return null;
    }
  }

  return null;
}

export const getSources = (providerName) => {
  if (providerName in sources) {
    return sources[providerName].sources;
  }
  return undefined;
};

export const getSource = (providerName, key) => {
  const sources = getSources(providerName);
  if (sources) {
    return sources[key];
  }
  return undefined;
};

export const subscribe = (subscriber) => {
  if (typeof subscriber !== 'function') {
    throw new Error('Callback is not a function');
  }

  const id = nextSubscriberId;
  nextSubscriberId++;
  subscribers[id] = subscriber;

  const unsubscribe = () => {
    delete subscribers[id];
  };
  return unsubscribe;
};

export const initSources = (providerName) => {

  if (providerName in rawSources) {
    return;
  }

  rawSources[providerName] = createRawSource();
  sources[providerName] = createSource();

  notifySubscribers();
};

export const clearSources = (providerName) => {

  const hasSources = providerName in rawSources;

  if (!hasSources) {
    return;
  }

  rawSources[providerName] = createRawSource();
  noopSourceSetters(providerName);
  sources[providerName] = createSource();

  notifySubscribers();
};

export const removeSources = (providerName) => {
  delete rawSources[providerName];
  noopSourceSetters(providerName);
  delete sources[providerName];
  notifySubscribers();
};

export const sourcesChanged = (providerName, sourceChanges) => {

  if (typeof rawSources[providerName] === 'undefined') {
    rawSources[providerName] = createRawSource();
    sources[providerName] = createSource();
  }

  const sourcesRoot = rawSources[providerName];

  for (let key in sourceChanges) {

    const value = sourceChanges[key];

    const keyParts = key.split('/');
    const normalizedKey = normalizeKey(key);
    const normalizedKeyParts = normalizedKey.split('/');

    let rawSources = sourcesRoot.__sources__;
    let prevRawSource = {};

    normalizedKeyParts.forEach((keyPart, index) => {
      const inSources = keyPart in rawSources;
      const sourceKey = keyParts.slice(0, index + 1).join('/');
      const providerSources = sources[providerName];

      if (!inSources) {
        rawSources[keyPart] = {
          __fromProvider__: false,
          __normalizedKey__: normalizedKeyParts.slice(0, index + 1).join('/'),
          __key__: sourceKey,
          __value__: undefined,
          __sources__: {}
        }

        providerSources.getters[sourceKey] = () => {
          return {};
        };
        providerSources.setters[sourceKey] = () => {};
        Object.defineProperty(providerSources.sources, sourceKey, {
          set(value) {
            providerSources.setters[sourceKey](value);
          },
          get() {
            return providerSources.getters[sourceKey]();
          }
        });
      }

      if (normalizedKeyParts.length - 1 === index) {

        rawSources[keyPart].__fromProvider__ = true;
        rawSources[keyPart].__value__ = value;

        if (Object.keys(rawSources[keyPart].__sources__).length === 0) {
          providerSources.getters[sourceKey] = () => {
            return value;
          };
        }

        const sourceProvider = getSourceProvider(providerName);
        providerSources.setters[sourceKey] = (value) => {
          sourceProvider.updateFromDashboard(sourceKey, value);
        };

      }

      if (index !== 0) {

        const value = {};
        for (let key in rawSources) {
          const rawSource = rawSources[key];
          Object.defineProperty(value, key, {
            set(value) {
              providerSources.setters[rawSource.__key__](value);
            },
            get() {
              return providerSources.getters[rawSource.__key__]();
            }
          });
        }
        
        providerSources.getters[prevRawSource.__key__] = () => {
          return value;
        };
      }

      prevRawSource = rawSources[keyPart];
      rawSources = rawSources[keyPart].__sources__;
    });
  }
  notifySubscribers();
};