(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('redux')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'redux'], factory) :
  (global = global || self, factory(global.WebbitStore = {}, global._, global.Redux));
}(this, (function (exports, lodash, redux) { 'use strict';

  class SourceProvider {
    static get typeName() {
      return null;
    }

    static get settingsDefaults() {
      return {};
    }

    get settings() {
      return {};
    }

    onSettingsChange(settings) {}

    updateFromProvider() {}

    updateFromDashboard() {}

    getType(value) {
      if (lodash.isString(value)) {
        return 'string';
      } else if (lodash.isNumber(value)) {
        return 'number';
      } else if (lodash.isBoolean(value)) {
        return 'boolean';
      } else if (lodash.isArray(value)) {
        return 'Array';
      } else if (lodash.isNull(value)) {
        return 'null';
      }

      return null;
    }

  }

  var INIT_SOURCES = "INIT_SOURCES";
  var CLEAR_SOURCES = "CLEAR_SOURCES";
  var REMOVE_SOURCES = "REMOVE_SOURCES";
  var SOURCES_CHANGED = "SOURCES_CHANGED";
  function initSources(providerName) {
    return {
      type: INIT_SOURCES,
      payload: {
        providerName
      }
    };
  }
  function removeSources(providerName) {
    return {
      type: REMOVE_SOURCES,
      payload: {
        providerName
      }
    };
  }
  function sourcesChanged(providerName, sourceChanges) {
    return {
      type: SOURCES_CHANGED,
      payload: {
        providerName,
        sourceChanges
      }
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var normalizeKey = key => {
    return key.split('/').map(keyPart => lodash.camelCase(keyPart)).join('/');
  };

  var initialState = {
    sources: {}
  };

  var rootReducer = function rootReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case INIT_SOURCES:
        var newSources = _objectSpread2({}, state.sources[action.payload.providerName]);

        if (lodash.isEmpty(newSources)) {
          newSources = {
            __normalizedKey__: undefined,
            __fromProvider__: false,
            __key__: undefined,
            __value__: undefined,
            __sources__: {}
          };
        }

        return _objectSpread2({}, state, {
          sources: _objectSpread2({}, state.sources, {
            [action.payload.providerName]: newSources
          })
        });

      case SOURCES_CHANGED:
        var {
          sourceChanges,
          providerName
        } = action.payload;

        var sourcesRoot = _objectSpread2({}, state.sources[providerName]);

        if (lodash.isEmpty(sourcesRoot)) {
          sourcesRoot = {
            __normalizedKey__: undefined,
            __fromProvider__: false,
            __key__: undefined,
            __value__: undefined,
            __sources__: {}
          };
        }

        lodash.forEach(sourceChanges, (value, key) => {
          var keyParts = key.split('/');
          var normalizedKey = normalizeKey(key);
          var normalizedKeyParts = normalizedKey.split('/');
          var sources = sourcesRoot.__sources__;
          normalizedKeyParts.forEach((keyPart, index) => {
            var inSources = keyPart in sources;

            if (!inSources) {
              sources[keyPart] = {
                __fromProvider__: false,
                __normalizedKey__: normalizedKeyParts.slice(0, index + 1).join('/'),
                __key__: keyParts.slice(0, index + 1).join('/'),
                __value__: undefined,
                __sources__: {}
              };
            }

            if (normalizedKeyParts.length - 1 === index) {
              sources[keyPart].__fromProvider__ = true;

              if (typeof value !== 'undefined') {
                sources[keyPart].__value__ = value;
              }
            } else {
              sources = sources[keyPart].__sources__;
            }
          });
        });
        return _objectSpread2({}, state, {
          sources: _objectSpread2({}, state.sources, {
            [providerName]: sourcesRoot
          })
        });

      case CLEAR_SOURCES:
        var shouldClear = action.payload.providerName in state.sources;

        if (!shouldClear) {
          return state;
        }

        return _objectSpread2({}, state, {
          sources: _objectSpread2({}, state.sources, {
            [action.payload.providerName]: {
              __fromProvider__: false,
              __normalizedKey__: undefined,
              __key__: undefined,
              __value__: undefined,
              __sources__: {}
            }
          })
        });

      case REMOVE_SOURCES:
        var allSources = _objectSpread2({}, state.sources);

        delete allSources[action.payload.providerName];
        return _objectSpread2({}, state, {
          sources: allSources
        });

      default:
        return state;
    }
  };

  var reduxStore = redux.createStore(rootReducer);

  class SourceManager {
    constructor(provider, providerName) {
      this.providerName = providerName;
      this.provider = provider;
      this.sourceUpdates = {};
      this.provider.updateFromProvider(this._updateSource.bind(this));
      this.interval = setInterval(this._sendUpdates.bind(this), 100);
    }

    _disconnect() {
      clearTimeout(this.interval);
    }

    _updateSource(key, value) {
      if (this.sourceUpdates[key] === undefined) {
        this.sourceUpdates[key] = {
          first: value
        };
      } else {
        this.sourceUpdates[key].last = value;
      }
    }

    subscribe(key, callback, callImmediately) {
      var unsubscribe = reduxStore.subscribe(() => {
        callback(this.getSource(key));
      });

      if (callImmediately) {
        callback(this.getSource(key));
      }

      return unsubscribe;
    }

    getSource(key) {
      key = key || '';
      var source = this.getRawSource(key);

      if (!source) {
        return undefined;
      }

      var rawValue = source.__value__;
      var sources = source.__sources__;
      var sourceProvider = this.provider;

      if (Object.keys(sources).length > 0) {
        var value = {};
        lodash.forEach(sources, (source, propertyName) => {
          var sourceValue = this.getSource(source.__key__);
          Object.defineProperty(value, propertyName, {
            get() {
              return sourceValue;
            },

            set(value) {
              var sourceKey = source.__key__;

              if (typeof sourceKey === 'string' && sourceProvider) {
                sourceProvider.updateFromDashboard(sourceKey, value);
              }
            }

          });
        });
        return value;
      }

      if (typeof rawValue === 'boolean') {
        return rawValue;
      } else if (typeof rawValue === 'number') {
        return rawValue;
      } else if (typeof rawValue === 'string') {
        return rawValue;
      } else if (rawValue instanceof Array) {
        return [...rawValue];
      }

      return {};
    }

    getRawSource(key) {
      key = key || '';
      var sourcesRoot = reduxStore.getState().sources[this.providerName];

      if (typeof sourcesRoot === 'undefined') {
        return null;
      }

      var keyParts = normalizeKey(key).split('/');
      var sources = sourcesRoot.__sources__;

      for (var index in keyParts) {
        var keyPart = keyParts[index];

        if (keyParts.length - 1 === parseInt(index)) {
          return keyPart in sources ? sources[keyPart] : null;
        }

        if (keyPart in sources) {
          sources = sources[keyPart].__sources__;
        } else {
          return null;
        }
      }

      return null;
    }

    _sendUpdates() {
      if (Object.keys(this.sourceUpdates).length === 0) {
        return;
      } // send first updates then last


      var firstUpdates = {};
      var lastUpdates = {};
      lodash.forEach(this.sourceUpdates, (values, key) => {
        firstUpdates[key] = values.first;
        if ('last' in values) lastUpdates[key] = values.last;
      });
      reduxStore.dispatch(sourcesChanged(this.providerName, firstUpdates));

      if (Object.keys(lastUpdates).length > 0) {
        setTimeout(() => {
          reduxStore.dispatch(sourcesChanged(this.providerName, lastUpdates));
        });
      }

      this.sourceUpdates = {};
    }

  }

  var managers = {};
  var providerTypes = {};
  var providers = {};
  var sourceProviderListeners = [];
  var hasSourceManager = providerName => {
    return providerName in managers;
  };
  var getSourceManager = providerName => {
    return managers[providerName];
  };

  var addSourceManager = (providerType, providerName) => {
    providerName = providerName || providerType;

    if (hasSourceManager(providerName) || !hasSourceProvider(providerName) || !hasSourceProviderType(providerType)) {
      return;
    }

    managers[providerName] = new SourceManager(getSourceProvider(providerName), providerName);
    reduxStore.dispatch(initSources(providerName));
  };

  var removeSourceManager = providerName => {
    if (!hasSourceManager(providerName)) {
      return;
    }

    var manager = getSourceManager(providerName);

    manager._disconnect();

    reduxStore.dispatch(removeSources(providerName));
    delete managers[providerName];
  };

  var addSourceProviderType = constructor => {
    var {
      typeName
    } = constructor;

    if (hasSourceProviderType(typeName)) {
      return;
    }

    if (Object.getPrototypeOf(constructor).name === 'SourceProvider') {
      providerTypes[typeName] = constructor;
    }
  };
  var hasSourceProviderType = typeName => {
    return typeName in providerTypes;
  };
  var addSourceProvider = (providerType, providerName, settings) => {
    settings = settings || {};

    if (typeof providerName !== 'string') {
      providerName = providerType;
    }

    if (!hasSourceProviderType(providerType) || hasSourceProvider(providerName)) {
      return null;
    }

    var SourceProvider = providerTypes[providerType];
    providers[providerName] = new SourceProvider(_objectSpread2({}, SourceProvider.settingsDefaults, {}, settings));
    addSourceManager(providerType, providerName);
    sourceProviderListeners.forEach(listener => {
      listener(providerName);
    });
    return providers[providerName];
  };
  var sourceProviderAdded = listener => {
    if (typeof listener !== 'function') {
      return;
    }

    sourceProviderListeners.push(listener);
  };
  var removeSourceProvider = providerName => {
    if (!hasSourceProvider(providerType)) {
      return;
    }

    delete providers[providerName];
    removeSourceManager(providerName);
  };
  var getSourceProvider = providerName => {
    return providers[providerName];
  };
  var getSourceProviderTypeNames = () => {
    return Object.keys(providerTypes);
  };
  var getSourceProviderNames = () => {
    return Object.keys(providers);
  };
  var hasSourceProvider = providerName => {
    return providerName in providers;
  };
  var getState = () => {
    return reduxStore.getState();
  };

  var SourceProvider$1 = SourceProvider;
  var SourceManager$1 = SourceManager;

  exports.SourceManager = SourceManager$1;
  exports.SourceProvider = SourceProvider$1;
  exports.addSourceProvider = addSourceProvider;
  exports.addSourceProviderType = addSourceProviderType;
  exports.getSourceManager = getSourceManager;
  exports.getSourceProvider = getSourceProvider;
  exports.getSourceProviderNames = getSourceProviderNames;
  exports.getSourceProviderTypeNames = getSourceProviderTypeNames;
  exports.getState = getState;
  exports.hasSourceManager = hasSourceManager;
  exports.hasSourceProvider = hasSourceProvider;
  exports.hasSourceProviderType = hasSourceProviderType;
  exports.removeSourceProvider = removeSourceProvider;
  exports.sourceProviderAdded = sourceProviderAdded;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
