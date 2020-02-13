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

const notifySubscribers = () => {
  for (let id in subscribers) {
    const subscriber = subscribers[id];
    subscriber();
  }
};

const cleanSource = (providerName, rawSources, normalizedKeyParts) => {
  if (normalizedKeyParts.length === 0) {
    return;
  }

  const keyPart = normalizedKeyParts[0];

  const rawSource = rawSources[keyPart];

  if (typeof rawSource === 'undefined') {
    return;
  }

  if (normalizedKeyParts.length > 1) {
    cleanSource(providerName, rawSource.__sources__, normalizedKeyParts.slice(1));
  }

  if (
    Object.keys(rawSource.__sources__).length === 0 &&
    !rawSource.__fromProvider__
  ) {
    delete rawSources[keyPart];
  }

  if (typeof rawSources[keyPart] === 'undefined') {
    delete sources[providerName].sources[rawSource.__key__];
    delete sources[providerName].getters[rawSource.__key__];
    delete sources[providerName].setters[rawSource.__key__];
    return;
  }

  const value = {};
  for (let key in rawSource.__sources__) {
    const rawSubSource = rawSource.__sources__[key];
    Object.defineProperty(value, key, {
      set(value) {
        const providerSources = sources[providerName];
        
        if (typeof providerSources === 'undefined') {
          return;
        }

        const setter = providerSources.setters[rawSubSource.__key__];

        if (typeof setter === 'undefined') {
          return;
        }

        setter(value);
      },
      get() {
        const providerSources = sources[providerName];

        if (typeof providerSources === 'undefined') {
          return {};
        }

        const getter = providerSources.getters[rawSubSource.__key__];

        if (typeof getter === 'undefined') {
          return {};
        }

        return getter();
      }
    });
  }

  const providerSources = sources[providerName];

  if (Object.getOwnPropertyNames(value).length > 0) {
    providerSources.getters[rawSource.__key__] = () => {
      return value;
    };
  } else if (rawSource.__fromProvider__) {
    providerSources.getters[rawSource.__key__] = () => {
      return rawSource.__value__;
    };
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
  sources[providerName] = createSource();

  notifySubscribers();
};

export const removeSources = (providerName) => {
  delete rawSources[providerName];
  noopSourceSetters(providerName);
  delete sources[providerName];
  notifySubscribers();
};

export const sourcesRemoved = (providerName, sourceRemovals) => {
  if (typeof rawSources[providerName] === 'undefined') {
    return;
  }

  const sourcesRoot = rawSources[providerName];

  for (let key of sourceRemovals) {
    const normalizedKey = normalizeKey(key);
    const normalizedKeyParts = normalizedKey.split('/');

    let rawSources = sourcesRoot.__sources__;

    for (let index in normalizedKeyParts) {

      const keyPart = normalizedKeyParts[index];
      const inSources = keyPart in rawSources;

      if (!inSources) {
        break;
      }

      if (normalizedKeyParts.length - 1 === parseInt(index)) {
        rawSources[keyPart].__fromProvider__ = false;
        rawSources[keyPart].__value__ = undefined;
      }

      rawSources = rawSources[keyPart].__sources__;
    }

    cleanSource(providerName, sourcesRoot.__sources__, normalizedKeyParts);
  }
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
          configurable: true,
          set(value) {     
            const providerSources = sources[providerName];

            if (typeof providerSources === 'undefined') {
              return;
            }

            const setter = providerSources.setters[sourceKey];

            if (typeof setter === 'undefined') {
              return;
            }

            setter(value);
          },
          get() {
            const providerSources = sources[providerName];

            if (typeof providerSources === 'undefined') {
              return {};
            }

            const getter = providerSources.getters[sourceKey];

            if (typeof getter === 'undefined') {
              return {};
            }

            return getter();
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
              const providerSources = sources[providerName];
              
              if (typeof providerSources === 'undefined') {
                return;
              }

              const setter = providerSources.setters[rawSource.__key__];

              if (typeof setter === 'undefined') {
                return;
              }

              setter(value);
            },
            get() {
              const providerSources = sources[providerName];

              if (typeof providerSources === 'undefined') {
                return {};
              }

              const getter = providerSources.getters[rawSource.__key__];

              if (typeof getter === 'undefined') {
                return {};
              }

              return getter();
            }
          });
        }
        
        providerSources.getters[prevRawSource.__key__] = () => {
          const providerSources = sources[providerName];

          if (
            typeof providerSources === 'undefined' ||
            typeof providerSources.getters[prevRawSource.__key__] === 'undefined'
          ) {
            return {};
          }

          return value;
        };
      }

      prevRawSource = rawSources[keyPart];
      rawSources = rawSources[keyPart].__sources__;
    });
  }
  notifySubscribers();
};