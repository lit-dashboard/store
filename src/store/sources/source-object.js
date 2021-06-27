import { normalizeKey } from '../../util';
import { Source } from './source-factory';

const sourceObjectRefs = {};

export const getSourceObject = (providerName, key) => {

  key = normalizeKey(key);

  if (typeof sourceObjectRefs[providerName] === 'undefined') {
    sourceObjectRefs[providerName] = {};
  }

  if (typeof sourceObjectRefs[providerName][key] === 'undefined') {
    sourceObjectRefs[providerName][key] = new Source();
  }

  return sourceObjectRefs[providerName][key];
};

export const setSourceObjectProps = (providerName, key, rawSource, sources) => {
  const value = getSourceObject(providerName, key);

  Object.getOwnPropertyNames(value).forEach(prop => {
    if (prop in rawSource.__sources__) {
      return;
    }
    delete value[prop];
  });

  for (let key in rawSource.__sources__) {

    const normalizedKey = normalizeKey(key);

    if (normalizedKey in value) {
      continue;
    }

    const rawSubSource = rawSource.__sources__[key];
    Object.defineProperty(value, normalizedKey, {
      configurable: true,
      set(value) {
        const providerSources = sources[providerName];

        if (typeof providerSources === 'undefined') {
          return;
        }

        const setter = providerSources.setters[rawSubSource.__normalizedKey__];

        if (typeof setter === 'undefined') {
          return;
        }

        setter(value);
      },
      get() {
        if (typeof sources[providerName] === 'undefined') {
          return undefined;
        }
        return sources[providerName].getterValues[rawSubSource.__normalizedKey__];
      }
    });
  }
};