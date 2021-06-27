import { normalizeKey } from '../../util';
import { getSourceProvider } from '../index';
import { createRawSource, createSource, isSourceType } from './source-factory';
import { 
  addSubscriber, 
  addSubscriberAll,
  notifySubscribers,
  notifySubscribersRemoved,
} from './subscribers';
import { getSourceObject, setSourceObjectProps } from './source-object';
import { rawSources, sources, cleanSource, getRawSource } from './sources';
export { getRawSource, getRawSources } from './sources';

export const getSources = (providerName) => {
  if (providerName in sources) {
    return sources[providerName].sources;
  }
  return undefined;
};

export const getSource = (providerName, key) => {
  const sources = getSources(providerName);
  if (sources) {
    return sources[normalizeKey(key)];
  }
  return undefined;
};

export const subscribe = (providerName, key, callback, callImmediately) => {
  return addSubscriber(providerName, key, callback, callImmediately, getSource);
};

export const subscribeAll = (providerName, callback, callImmediately) => {
  return addSubscriberAll(providerName, callback, callImmediately, getSources);
};

export const clearSources = (providerName) => {

  const hasSources = providerName in rawSources;

  if (!hasSources) {
    return;
  }

  const sourceKeys = Object.getOwnPropertyNames(getSources(providerName) || {});
  const keysFomProviders = sourceKeys.filter(key => {
    return getRawSource(providerName, key).__fromProvider__;
  });

  for (let key in sources[providerName].getterValues) {
    const getterValue = sources[providerName].getterValues[key];
    if (isSourceType(getterValue)) {
      Object.getOwnPropertyNames(getterValue).forEach(prop => {
        delete getterValue[prop];
      });
    }
  }

  rawSources[providerName] = createRawSource();
  sources[providerName] = createSource();

  notifySubscribersRemoved(providerName, sourceKeys, keysFomProviders);
};

export const removeSources = (providerName) => {

  const hasSources = providerName in rawSources;

  if (!hasSources) {
    return;
  }

  const sourceKeys = Object.getOwnPropertyNames(getSources(providerName));
  const keysFomProviders = sourceKeys.filter(key => {
    return getRawSource(providerName, key).__fromProvider__;
  });

  for (let key in sources[providerName].getterValues) {
    const getterValue = sources[providerName].getterValues[key];
    if (isSourceType(getterValue)) {
      Object.getOwnPropertyNames(getterValue).forEach(prop => {
        delete getterValue[prop];
      });
    }
  }

  delete rawSources[providerName];
  delete sources[providerName];

  notifySubscribersRemoved(providerName, sourceKeys, keysFomProviders);
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
      const normalizedKeyPartsJoined = normalizedKeyParts.slice(0, index + 1).join('/');

      if (!inSources) {
        rawSources[keyPart] = {
          __fromProvider__: false,
          __normalizedKey__: normalizedKeyPartsJoined,
          __key__: sourceKey,
          __value__: undefined,
          __sources__: {}
        }

        providerSources.getterValues[normalizedKeyPartsJoined] = getSourceObject(providerName, sourceKey);
        providerSources.setters[normalizedKeyPartsJoined] = () => { };
        Object.defineProperty(providerSources.sources, normalizedKeyPartsJoined, {
          configurable: true,
          set(value) {
            const providerSources = sources[providerName];

            if (typeof providerSources === 'undefined') {
              return;
            }

            const setter = providerSources.setters[normalizedKeyPartsJoined];

            if (typeof setter === 'undefined') {
              return;
            }

            setter(value);
          },
          get() {
            if (typeof sources[providerName] === 'undefined') {
              return undefined;
            }
            return sources[providerName].getterValues[normalizedKeyPartsJoined];
          }
        });
      }

      if (normalizedKeyParts.length - 1 === index) {

        rawSources[keyPart].__fromProvider__ = true;
        rawSources[keyPart].__value__ = value;

        if (Object.keys(rawSources[keyPart].__sources__).length === 0) {
          providerSources.getterValues[normalizedKeyPartsJoined] = value;
        }

        const sourceProvider = getSourceProvider(providerName);
        providerSources.setters[normalizedKeyPartsJoined] = (value) => {
          sourceProvider.userUpdate(sourceKey, value);
        };

      }

      if (index !== 0) {

        if (!isSourceType(providerSources.getterValues[prevRawSource.__normalizedKey__])) {
          providerSources.getterValues[prevRawSource.__normalizedKey__] = getSourceObject(providerName, prevRawSource.__normalizedKey__);
        }

        setSourceObjectProps(providerName, prevRawSource.__normalizedKey__, prevRawSource, sources);
      }

      prevRawSource = rawSources[keyPart];
      rawSources = rawSources[keyPart].__sources__;
    });

    notifySubscribers(providerName, key, getSource);
  }
};