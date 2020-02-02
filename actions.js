export var INIT_SOURCES = "INIT_SOURCES";
export var CLEAR_SOURCES = "CLEAR_SOURCES";
export var REMOVE_SOURCES = "REMOVE_SOURCES";
export var SOURCES_CHANGED = "SOURCES_CHANGED";
export function initSources(providerName) {
  return {
    type: INIT_SOURCES,
    payload: {
      providerName
    }
  };
}
export function clearSources(providerName) {
  return {
    type: CLEAR_SOURCES,
    payload: {
      providerName
    }
  };
}
;
export function removeSources(providerName) {
  return {
    type: REMOVE_SOURCES,
    payload: {
      providerName
    }
  };
}
;
export function sourcesChanged(providerName, sourceChanges) {
  return {
    type: SOURCES_CHANGED,
    payload: {
      providerName,
      sourceChanges
    }
  };
}