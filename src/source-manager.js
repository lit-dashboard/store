import { sourcesChanged } from './actions';
import reduxStore from './redux-store';
import { normalizeKey } from './util';

export default class SourceManager {

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
    }
    else {
      this.sourceUpdates[key].last = value;
    }
  }

  subscribe(key, callback, callImmediately) {
    const unsubscribe = reduxStore.subscribe(() => {
      callback(this.getSource(key));
    });

    if (callImmediately) {
      callback(this.getSource(key));
    }

    return unsubscribe;
  }
  
  getSource(key) {
    key = key || '';
    const source = this.getRawSource(key);

    if (!source) {
      return undefined;
    }

    const rawValue = source.__value__;
    const sources = source.__sources__;
    const sourceProvider = this.provider;

    if (Object.keys(sources).length > 0) {
      let value = {};

      for (let propertyName in sources) {
        const source = sources[propertyName];
        const sourceValue = this.getSource(source.__key__);
        Object.defineProperty(value, propertyName, {
          get() {
            return sourceValue;
          },
          set(value) {
            const sourceKey = source.__key__;
            if (typeof sourceKey === 'string' && sourceProvider) {
              sourceProvider.updateFromDashboard(sourceKey, value);
            }
          }
        });
      }

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
    let sourcesRoot = reduxStore.getState().sources[this.providerName];

    if (typeof sourcesRoot === 'undefined') {
      return null;
    }

    const keyParts = normalizeKey(key).split('/');
  
    let sources = sourcesRoot.__sources__;
  
    for (let index in keyParts) {
      const keyPart = keyParts[index];
  
      if (keyParts.length - 1 === parseInt(index)) {
        return (keyPart in sources) ? sources[keyPart] : null;
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
    }
    // send first updates then last
    const firstUpdates = {};
    const lastUpdates = {};

    for (let key in this.sourceUpdates) {
      const values = this.sourceUpdates[key];
      firstUpdates[key] = values.first;
      if ('last' in values)
        lastUpdates[key] = values.last;
    }

    reduxStore.dispatch(sourcesChanged(this.providerName, firstUpdates));
    if (Object.keys(lastUpdates).length > 0) {
      setTimeout(() => {
        reduxStore.dispatch(sourcesChanged(this.providerName, lastUpdates));
      });
    }
  
    this.sourceUpdates = {};
  }
}
