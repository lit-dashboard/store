

const providerTypes = {};
const providers = {};
const sourceProviderListeners = [];

export const addSourceProviderType = (constructor) => {
  
  const { typeName } = constructor;

  if (hasSourceProviderType(typeName)) {
    return;
  }

  if (Object.getPrototypeOf(constructor).name === 'SourceProvider') {
    providerTypes[typeName] = constructor;
  }
}

export const hasSourceProviderType = (typeName) => {
  return typeName in providerTypes;
}

export const addSourceProvider = (providerType, providerName, settings) => {

  settings = settings || {};
  
  if (typeof providerName !== 'string') {
    providerName = providerType;
  }

  if (!hasSourceProviderType(providerType) || hasSourceProvider(providerName)) {
    return null;
  }

  const SourceProvider = providerTypes[providerType];

  providers[providerName] = new SourceProvider(providerName, {
    ...SourceProvider.settingsDefaults,
    ...settings
  });

  sourceProviderListeners.forEach(listener => {
    listener(providerName);
  }); 
  return providers[providerName];
};

export const sourceProviderAdded = (listener) => {

  if (typeof listener !== 'function') {
    return;
  }

  sourceProviderListeners.push(listener);
};

export const removeSourceProvider = (providerName) => {
  if (!hasSourceProvider(providerName)) {
    return;
  }

  const provider = providers[providerName];
  provider._disconnect();
  delete providers[providerName];
}

export const getSourceProvider = (providerName) => {
  return providers[providerName];
};

export const getSourceProviderTypeNames = () => {
  return Object.keys(providerTypes);
};

export const getSourceProviderNames = () => {
  return Object.keys(providers);
};

export const hasSourceProvider = (providerName) => {
  return providerName in providers;
};

export { getSources, getSource, sourcesRemoved } from './sources';