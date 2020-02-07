
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

  onSettingsChange(settings) {}

  updateFromProvider() {}
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
}
