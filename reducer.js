function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { INIT_SOURCES, SOURCES_CHANGED, CLEAR_SOURCES, REMOVE_SOURCES } from './actions';
import { forEach, isEmpty } from 'lodash';
import { normalizeKey } from './util';
var initialState = {
  sources: {}
};

var rootReducer = function rootReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case INIT_SOURCES:
      var newSources = _objectSpread({}, state.sources[action.payload.providerName]);

      if (isEmpty(newSources)) {
        newSources = {
          __normalizedKey__: undefined,
          __fromProvider__: false,
          __key__: undefined,
          __value__: undefined,
          __sources__: {}
        };
      }

      return _objectSpread({}, state, {
        sources: _objectSpread({}, state.sources, {
          [action.payload.providerName]: newSources
        })
      });

    case SOURCES_CHANGED:
      var {
        sourceChanges,
        providerName
      } = action.payload;

      var sourcesRoot = _objectSpread({}, state.sources[providerName]);

      if (isEmpty(sourcesRoot)) {
        sourcesRoot = {
          __normalizedKey__: undefined,
          __fromProvider__: false,
          __key__: undefined,
          __value__: undefined,
          __sources__: {}
        };
      }

      forEach(sourceChanges, (value, key) => {
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
      return _objectSpread({}, state, {
        sources: _objectSpread({}, state.sources, {
          [providerName]: sourcesRoot
        })
      });

    case CLEAR_SOURCES:
      var shouldClear = action.payload.providerName in state.sources;

      if (!shouldClear) {
        return state;
      }

      return _objectSpread({}, state, {
        sources: _objectSpread({}, state.sources, {
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
      var allSources = _objectSpread({}, state.sources);

      delete allSources[action.payload.providerName];
      return _objectSpread({}, state, {
        sources: allSources
      });

    default:
      return state;
  }
};

export default rootReducer;