import { 
  initSources, 
  removeSources,
} from './sources';
import SourceManager from '../source-manager';

const managers = {};
const providerTypes = {};
const providers = {};
const sourceProviderListeners = [];

export const hasSourceManager = (providerName) => {
  return providerName in managers;
};

export const getSourceManager = (providerName) => {
  return managers[providerName];
};

const addSourceManager = (providerType, providerName) => {
  providerName = providerName || providerType;

  if (
    hasSourceManager(providerName) 
    || !hasSourceProvider(providerName) 
    || !hasSourceProviderType(providerType)
  ) {
    return;
  }

  managers[providerName] = new SourceManager(
    getSourceProvider(providerName), 
    providerName
  );
  initSources(providerName);
};

const removeSourceManager = (providerName) => {
  if (!hasSourceManager(providerName)) {
    return;
  }
  const manager = getSourceManager(providerName);
  manager._disconnect();
  removeSources(providerName);
  delete managers[providerName];
};

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

  providers[providerName] = new SourceProvider({
    ...SourceProvider.settingsDefaults,
    ...settings
  });

  addSourceManager(providerType, providerName);
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
  if (!hasSourceProvider(providerType)) {
    return;
  }

  delete providers[providerName];
  removeSourceManager(providerName);
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

export { getSources, getSource } from './sources';