import { 
  subscribe,
  sourcesChanged,
  getRawSource,
  getSource,
  clearSources, 
  sourcesRemoved
} from './store/sources';

export default class SourceProvider {
  
  static get typeName() {
    return null;
  }

  static get settingsDefaults() {
		return {};
  }

  get settings() {
    return {};
  }

  constructor(providerName) {
    this._providerName = providerName;
    this._sourceUpdates = {};
    this._sourceRemovals = [];
    this._interval = setInterval(this._sendUpdates.bind(this), 100);
  }


  updateSource(key, value) {
    if (this._sourceUpdates[key] === undefined) {
      this._sourceUpdates[key] = {
        first: value
      };
    }
    else {
      this._sourceUpdates[key].last = value;
    }
  }

  removeSource(key) {
    console.log("KEY:", key, !this._sourceRemovals.includes(key));
    if (!this._sourceRemovals.includes(key)) {
      this._sourceRemovals.push(key);
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
    return getSource(this._providerName, key);
  }

  getRawSource(key) {
    return getRawSource(this._providerName, key);
  }

  clearSources() {
    clearSources(this._providerName);
  }

  onSettingsChange(settings) {}

  updateFromDashboard() {}

  getType(value) {
    if (typeof value === 'string') {
      return 'string';
    } else if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'boolean';
    } else if (value instanceof Array) {
      return 'Array';
    } else if (value === null) {
      return 'null';
    }
    return null;
  }

  _disconnect() {
    clearTimeout(this._interval);
  }

  _sendUpdates() {
    this._sendChanges();
    this._sendRemovals();
  }

  _sendChanges() {
    if (Object.keys(this._sourceUpdates).length === 0) {
      return;
    }
    // send first updates then last
    const firstUpdates = {};
    const lastUpdates = {};

    for (let key in this._sourceUpdates) {
      const values = this._sourceUpdates[key];
      firstUpdates[key] = values.first;
      if ('last' in values)
        lastUpdates[key] = values.last;
    }

    sourcesChanged(this._providerName, firstUpdates);
    if (Object.keys(lastUpdates).length > 0) {
      setTimeout(() => {
        sourcesChanged(this._providerName, lastUpdates);
      });
    }
  
    this._sourceUpdates = {};
  }

  _sendRemovals() {
    if (this._sourceRemovals.length > 0) {
      console.log("this._sourceRemovals:", this._sourceRemovals);
      sourcesRemoved(this._providerName, this._sourceRemovals);
      this._sourceRemovals = [];
    }
  }
}
