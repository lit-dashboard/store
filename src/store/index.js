import { sourcesObject } from './sources';


/**
 @module @webbitjs/store
*/
class Store {

  constructor() {
    this.providerTypes = {};
    this.providers = {};
    this.defaultSourceProvider = null;
    this.sourceProviderListeners = [];
    this.defaultSourceProviderListeners = [];
  }

  /**
 * Adds a provider type.
 * 
 * @function
 * @example
 * import { SourceProvider, addSourceProviderType } from "@webbitjs/store";
 * 
 * class MyProvider extends SourceProvider {
 *   // class body
 * }
 * 
 * addSourceProviderType(MyProvider);
 * 
 * @param {SourceProvider} constructor - The source provider class
 */
  addSourceProviderType(constructor) {

    const { typeName } = constructor;

    if (typeof typeName !== 'string') {
      throw new Error('A typeName for your source provider type must be set.');
    }

    if (this.hasSourceProviderType(typeName)) {
      throw new Error('A source provider type with the same name has already been added.');
    }

    if (constructor.__WEBBIT_CLASSNAME__ === 'SourceProvider') {
      this.providerTypes[typeName] = constructor;
    }
  }

  hasSourceProviderType(typeName) {
    return typeName in this.providerTypes;
  }

  hasSourceProvider (providerName) {
    return providerName in this.providers;
  }

  addSourceProvider(providerType, providerName, settings) {

    settings = settings || {};
  
    if (typeof providerName !== 'string') {
      providerName = providerType;
    }
  
    if (!this.hasSourceProviderType(providerType)) {
      throw new Error(`A source provider type with that name hasn't been added.`);
    }
  
    if (this.hasSourceProvider(providerName)) {
      throw new Error('A source provider with that name has already been added.');
    }
  
    const SourceProvider = this.providerTypes[providerType];
  
    this.providers[providerName] = new SourceProvider(providerName, {
      ...SourceProvider.settingsDefaults,
      ...settings
    });
  
    this.sourceProviderListeners.forEach(listener => {
      listener(providerName);
    });
    return this.providers[providerName];
  }

  sourceProviderAdded(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener is not a function');
    }
  
    this.sourceProviderListeners.push(listener);
  }

  removeSourceProvider(providerName) {
    if (!this.hasSourceProvider(providerName)) {
      return;
    }
  
    const provider = this.providers[providerName];
    provider._disconnect();
    delete this.providers[providerName];
  }

  getSourceProvider(providerName) {
    return this.providers[providerName];
  }
  
  getSourceProviderTypeNames() {
    return Object.keys(this.providerTypes);
  }
  
  getSourceProviderNames() {
    return Object.keys(this.providers);
  };

  setDefaultSourceProvider(providerName) {
    this.defaultSourceProvider = providerName;
  
    this.defaultSourceProviderListeners.forEach(listener => {
      listener(this.defaultSourceProvider);
    });
  }

  defaultSourceProviderSet(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener is not a function');
    }
  
    this.defaultSourceProviderListeners.push(listener);
  }

  getDefaultSourceProvider () {
    return this.defaultSourceProvider;
  }
}

export default Store;

const store = new Store();

export const addSourceProviderType = (constructor) => {
  store.addSourceProviderType(constructor);
}

export const hasSourceProviderType = (typeName) => {
  return store.hasSourceProviderType(typeName);
}

export const addSourceProvider = (providerType, providerName, settings) => {
  return store.addSourceProvider(providerType, providerName, settings);
};

export const sourceProviderAdded = (listener) => {
  store.sourceProviderAdded(listener);
};

export const removeSourceProvider = (providerName) => {
  store.removeSourceProvider(providerName);
}

export const getSourceProvider = (providerName) => {
  return store.getSourceProvider(providerName);
};

export const getSourceProviderTypeNames = () => {
  return store.getSourceProviderTypeNames();
};

export const getSourceProviderNames = () => {
  return store.getSourceProviderNames();
};

export const hasSourceProvider = (providerName) => {
  return store.hasSourceProvider(providerName);
};

export const setDefaultSourceProvider = (providerName) => {
  store.setDefaultSourceProvider(providerName);
};

export const getDefaultSourceProvider = () => {
  return store.getDefaultSourceProvider();
};

export const defaultSourceProviderSet = (listener) => {
  store.defaultSourceProviderSet(listener);
};

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

export const subscribe = (providerName, key, callback, callImmediately) => {
  return sourcesObject.subscribe(providerName, key, callback, callImmediately);
};

export const subscribeAll = (providerName, callback, callImmediately) => {
  return sourcesObject.subscribeAll(providerName, callback, callImmediately);
};
