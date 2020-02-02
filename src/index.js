import {
  hasSourceManager as _hasSourceManager,
  getSourceManager as _getSourceManager,
  addSourceProviderType as _addSourceProviderType,
  hasSourceProviderType as _hasSourceProviderType,
  addSourceProvider as _addSourceProvider,
  removeSourceProvider as _removeSourceProvider,
  getSourceProvider as _getSourceProvider,
  getSourceProviderTypeNames as _getSourceProviderTypeNames,
  getSourceProviderNames as _getSourceProviderNames,
  hasSourceProvider as _hasSourceProvider,
  getState as _getState
} from './store';
import _SourceProvider from './source-provider';
import _SourceManager from './source-manager';

export const hasSourceManager = _hasSourceManager;
export const getSourceManager = _getSourceManager;
export const addSourceProviderType = _addSourceProviderType;
export const hasSourceProviderType = _hasSourceProviderType;
export const addSourceProvider = _addSourceProvider;
export const removeSourceProvider = _removeSourceProvider;
export const getSourceProvider = _getSourceProvider;
export const getSourceProviderTypeNames = _getSourceProviderTypeNames;
export const getSourceProviderNames = _getSourceProviderNames;
export const hasSourceProvider = _hasSourceProvider;
export const getState = _getState;
export const SourceProvider = _SourceProvider;
export const SourceManager = _SourceManager;

