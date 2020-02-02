function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { initSources, removeSources } from './actions';
import SourceManager from './source-manager';
import reduxStore from './redux-store';
var managers = {};
var providerTypes = {};
var providers = {};
export var hasSourceManager = providerName => {
  return providerName in managers;
};
export var getSourceManager = providerName => {
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

export var addSourceProviderType = constructor => {
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
export var hasSourceProviderType = typeName => {
  return typeName in providerTypes;
};
export var addSourceProvider = (providerType, providerName, settings) => {
  settings = settings || {};

  if (typeof providerName !== 'string') {
    providerName = providerType;
  }

  if (!hasSourceProviderType(providerType) || hasSourceProvider(providerName)) {
    return null;
  }

  var SourceProvider = providerTypes[providerType];
  providers[providerName] = new SourceProvider(_objectSpread({}, SourceProvider.settingsDefaults, {}, settings));
  addSourceManager(providerType, providerName);
  return providers[providerName];
};
export var removeSourceProvider = providerName => {
  if (!hasSourceProvider(providerType)) {
    return;
  }

  delete providers[providerName];
  removeSourceManager(providerName);
};
export var getSourceProvider = providerName => {
  return providers[providerName];
};
export var getSourceProviderTypeNames = () => {
  return Object.keys(providerTypes);
};
export var getSourceProviderNames = () => {
  return Object.keys(providers);
};
export var hasSourceProvider = providerName => {
  return providerName in providers;
};
export var getState = () => {
  return reduxStore.getState();
};