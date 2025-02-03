import { useSyncExternalStore } from 'react';

class StoreManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState = () => this.state;

  createHook() {
    const useStoreHook = (selector = (state) => state) => {
      return useSyncExternalStore(
        this.subscribe.bind(this),
        () => selector(this.state),
        () => selector(this.state)
      );
    };

    useStoreHook.getState = this.getState;
    return useStoreHook;
  }

  createSetter() {
    return (updater) => {
      const nextState =
        typeof updater === 'function' ? updater(this.state) : { ...this.state, ...updater };

      if (!this.isEqual(this.state, nextState)) {
        this.state = nextState;
        this.listeners.forEach((listener) => listener());
      }
    };
  }

  isEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null)
      return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => this.isEqual(obj1[key], obj2[key]));
  }

  createKeyUpdater(key) {
    return (value) => {
      this.createSetter()((state) => ({
        [key]: typeof value === 'function' ? value(state[key]) : value
      }));
    };
  }
}

export function create(storeCreator) {
  const storeManager = new StoreManager();
  const initialStore = storeCreator(storeManager.createSetter(), storeManager.getState);
  storeManager.state = initialStore;
  const useStore = storeManager.createHook();
  useStore.setState = storeManager.createSetter();
  return useStore;
}
