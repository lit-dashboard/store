export const INIT_SOURCES = "INIT_SOURCES";
export const CLEAR_SOURCES = "CLEAR_SOURCES";
export const REMOVE_SOURCES = "REMOVE_SOURCES";
export const SOURCES_CHANGED = "SOURCES_CHANGED";

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
};

export function removeSources(providerName) {
  return {
    type: REMOVE_SOURCES,
    payload: {
      providerName
    }
  };
};

export function sourcesChanged(providerName, sourceChanges) {
  return {
    type: SOURCES_CHANGED,
    payload: {
      providerName,
      sourceChanges
    }
  };
}