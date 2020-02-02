import { 
  isString, 
  isNumber, 
  isBoolean, 
  isArray, 
  isNull,
} from 'lodash';

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
    if (isString(value)) {
      return 'string';
    } else if (isNumber(value)) {
      return 'number';
    } else if (isBoolean(value)) {
      return 'boolean';
    } else if (isArray(value)) {
      return 'Array';
    } else if (isNull(value)) {
      return 'null';
    }
    return null;
  }
}
