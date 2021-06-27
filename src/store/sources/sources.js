import { setSourceObjectProps } from './source-object';
import { notifySubscribersRemoved } from './subscribers';
import { normalizeKey } from '../../util';

export const rawSources = {};
export const sources = {};

export const cleanSource = (providerName, rawSources, normalizedKeyParts) => {
  if (normalizedKeyParts.length === 0) {
    return false;
  }

  const keyPart = normalizedKeyParts[0];

  const rawSource = rawSources[keyPart];

  if (typeof rawSource === 'undefined') {
    return false;
  }

  if (normalizedKeyParts.length > 1) {
    cleanSource(providerName, rawSource.__sources__, normalizedKeyParts.slice(1));
  }

  if (
    Object.keys(rawSource.__sources__).length === 0 &&
    !rawSource.__fromProvider__
  ) {
    delete rawSources[keyPart];
    delete sources[providerName].sources[rawSource.__normalizedKey__];
    delete sources[providerName].getterValues[rawSource.__normalizedKey__];
    delete sources[providerName].setters[rawSource.__normalizedKey__];
    notifySubscribersRemoved(providerName, [rawSource.__normalizedKey__]);
  } else {
    const providerSources = sources[providerName];
    setSourceObjectProps(providerName, rawSource.__normalizedKey__, rawSource, sources);
    if (Object.keys(rawSource.__sources__).length === 0) {
      providerSources.getterValues[rawSource.__normalizedKey__] = rawSource.__value__;
    }
  }

  return true;
};

export const getRawSources = (providerName) => {
  return rawSources[providerName];
};

export const getRawSource = (providerName, key) => {
  let sourcesRoot = getRawSources(providerName);

  if (typeof sourcesRoot === 'undefined') {
    return undefined;
  }

  if (typeof key !== 'string') {
    return sourcesRoot;
  }

  const keyParts = normalizeKey(key).split('/');

  let sources = sourcesRoot.__sources__;

  for (let index in keyParts) {
    const keyPart = keyParts[index];

    if (keyParts.length - 1 === parseInt(index)) {
      return (keyPart in sources) ? sources[keyPart] : undefined;
    }

    if (keyPart in sources) {
      sources = sources[keyPart].__sources__;
    } else {
      return undefined;
    }
  }

  return undefined;
}