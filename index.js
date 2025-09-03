import { useSyncExternalStore } from 'react';

class StoreManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  // Subscribe mechanism
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get current state
  getState = () => {
    return this.state;
  }

  // Create a hook for selecting specific state slice
  createHook() {
    const useStoreHook = (selector = state => state) => {
      const state = useSyncExternalStore(
        this.subscribe.bind(this),
        () => selector(this.state),
        () => selector(this.state)
      );

      return state;
    };

    // Attach getState method to the hook
    useStoreHook.getState = this.getState;

    return useStoreHook;
  }

  // Update state with flexible options
  createSetter() {
    return (updater) => {
      const nextState = typeof updater === 'function'
        ? updater(this.state)
        : { ...this.state, ...updater };

      // Only update if state actually changes
      if (!this.isEqual(this.state, nextState)) {
        this.state = nextState;
        this.listeners.forEach(listener => listener());
      }
    };
  }

  // Deep comparison to prevent unnecessary updates
  isEqual(obj1, obj2, visited = new WeakSet()) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return false;
    }

    // Handle React elements - compare by reference only
    if (obj1.$$typeof || obj2.$$typeof) {
      return obj1 === obj2;
    }

    // Check for circular references
    if (visited.has(obj1) || visited.has(obj2)) {
      return obj1 === obj2;
    }

    // Add to visited set to prevent infinite recursion
    visited.add(obj1);
    visited.add(obj2);

    // Handle functions - compare by reference only
    if (typeof obj1 === 'function' || typeof obj2 === 'function') {
      return obj1 === obj2;
    }

    // NEW: Handle Map & Set – compare size and entries reference BEFORE enumerating keys
    if (obj1 instanceof Map && obj2 instanceof Map) {
      if (obj1.size !== obj2.size) return false;
      const iter1 = obj1.entries();
      for (const [key, val] of iter1) {
        if (!obj2.has(key) || !this.isEqual(val, obj2.get(key), visited)) return false;
      }
      return true;
    }

    if (obj1 instanceof Set && obj2 instanceof Set) {
      if (obj1.size !== obj2.size) return false;
      for (const val of obj1) {
        if (!obj2.has(val)) return false;
      }
      return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!this.isEqual(obj1[key], obj2[key], visited)) return false;
    }

    return true;
  }

  // Helper method to update a specific key
  createKeyUpdater(key) {
    return (value) => {
      this.createSetter()((state) => ({
        [key]: typeof value === 'function' ? value(state[key]) : value
      }));
    };
  }
}

// Utility to create a store similar to Zustand
export function create(storeCreator) {
  const storeManager = new StoreManager();

  // Initialize the store
  const initialStore = storeCreator(
    storeManager.createSetter(),
    storeManager.getState
  );

  // Set initial state
  storeManager.state = initialStore;

  // Create hook and setter methods
  const useStore = storeManager.createHook();

  // Add methods to the hook
  useStore.setState = storeManager.createSetter();
  useStore.subscribe = storeManager.subscribe.bind(storeManager);

  return useStore;
}