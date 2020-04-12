import { 
  subscribe,
  sourcesChanged,
  getRawSource,
  getSource,
  clearSources, 
  sourcesRemoved
} from './store/sources';

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

  /**
   * Parent class all source providers must inherit from. Each source provider
   * instance is responsible for maintaining its own state object in the store. 
   * 
   * @memberof module:@webbitjs/store
   * @abstract
   * @param {string} providerName - The name of the provider.
   */
  constructor(providerName) {

    if (new.target === SourceProvider) {
      throw new TypeError("Cannot construct SourceProvider instances directly");
    }

    this._providerName = providerName;
    this._sourceUpdates = {};
    this._sourceRemovals = [];
    this._interval = setInterval(this._sendUpdates.bind(this), 100);
  }


  /** 
   * Updates the value of a source in the store. If the source doesn't
   * exist then it is added. Should only be called internally by the 
   * source provider.
   * 
   * @protected
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   * @param {*} value - The new value.
   */
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

  /**
   * Removes an existing source from the store. If the source
   * doesn't exist this does nothing. Should only be called 
   * internally by the source provider.
   * 
   * @protected
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   */
  removeSource(key) {
    if (!this._sourceRemovals.includes(key)) {
      this._sourceRemovals.push(key);
    }
  }

  /**
   * Subscribes to changes for a particular store.
   * 
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   * @param {function} callback - A function that takes in the source's
   * value as a parameter. It's called when the source changes.
   * @param {boolean} callImmediately - If true, the callback is called
   * immediately with the source's current value.
   */
  subscribe(key, callback, callImmediately) {
    return subscribe(this._providerName, key, callback, callImmediately);
  }

  /**
   * Gets a source's value.
   * 
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   */
  getSource(key) {
    return getSource(this._providerName, key);
  }

  getRawSource(key) {
    return getRawSource(this._providerName, key);
  }

  /**
   * Removes all sources in the store for this provider. Should only be
   * called internally by the source provider.
   * 
   * @protected
   */
  clearSources() {
    clearSources(this._providerName);
  }

  /**
   * Called when a source's value is modified by the user. This method
   * should be overridden by the child class to handle these updates.
   * This method should not be called directly.
   * 
   * @protected
   * @param {string} key - The source's key. This is a string separated
   * by '/'.
   * @param {*} value - The source's updated value.
   */
  userUpdate(key, value) {}

  /**
   * Helper function to get the type of a variable represented
   * by a string.
   * 
   * @param {*} value
   * @returns {string} - The value's type.
   */
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
      sourcesRemoved(this._providerName, this._sourceRemovals);
      this._sourceRemovals = [];
    }
  }
}

export default SourceProvider;