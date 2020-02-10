import { 
  subscribe,
  sourcesChanged,
  getRawSource,
  getSource
} from './store/sources';

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
    const unsubscribe = subscribe(() => {
      callback(this.getSource(key));
    });

    if (callImmediately) {
      callback(this.getSource(key));
    }

    return unsubscribe;
  }
  
  getSource(key) {
    return getSource(this.providerName, key);
  }

  getRawSource(key) {
    return getRawSource(this.providerName, key);
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

    sourcesChanged(this.providerName, firstUpdates);
    if (Object.keys(lastUpdates).length > 0) {
      setTimeout(() => {
        sourcesChanged(this.providerName, lastUpdates);
      });
    }
  
    this.sourceUpdates = {};
  }
}
