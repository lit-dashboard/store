import {
  INIT_SOURCES,
  SOURCES_CHANGED,
  CLEAR_SOURCES,
  REMOVE_SOURCES
} from './actions';
import { forEach, isEmpty } from 'lodash';
import { normalizeKey } from './util';

const initialState = {
  sources: {}
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {

    case INIT_SOURCES:

      let newSources = { ...state.sources[action.payload.providerName] };

      if (isEmpty(newSources)) {
        newSources = {
          __normalizedKey__: undefined,
          __fromProvider__: false,
          __key__: undefined,
          __value__: undefined,
          __sources__: {}
        };
      }

      return {
        ...state,
        sources: {
          ...state.sources,
          [action.payload.providerName]: newSources
        }
      };

    case SOURCES_CHANGED:

      let { sourceChanges, providerName } = action.payload;
      let sourcesRoot = { ...state.sources[providerName] };

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
        const keyParts = key.split('/');
        const normalizedKey = normalizeKey(key);
        const normalizedKeyParts = normalizedKey.split('/');

        let sources = sourcesRoot.__sources__;

        normalizedKeyParts.forEach((keyPart, index) => {
          const inSources = keyPart in sources;

          if (!inSources) {
            sources[keyPart] = {
              __fromProvider__: false,
              __normalizedKey__: normalizedKeyParts.slice(0, index + 1).join('/'),
              __key__: keyParts.slice(0, index + 1).join('/'),
              __value__: undefined,
              __sources__: {}
            }
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

      return {
        ...state,
        sources: {
          ...state.sources,
          [providerName]: sourcesRoot
        }
      };

    case CLEAR_SOURCES:

      const shouldClear = action.payload.providerName in state.sources;

      if (!shouldClear) {
        return state;
      }
      
      return {
        ...state,
        sources: {
          ...state.sources,
          [action.payload.providerName]: {
            __fromProvider__: false,
            __normalizedKey__: undefined,
            __key__: undefined,
            __value__: undefined,
            __sources__: {}
          }
        }
      };

    case REMOVE_SOURCES:

      let allSources = { ...state.sources };
      delete allSources[action.payload.providerName];
      
      return {
        ...state,
        sources: allSources
      };

    default:
      return state;


  }
}

export default rootReducer;