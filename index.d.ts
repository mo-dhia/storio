import { useSyncExternalStore } from 'react';

type State = Record<string, any>;

type SetState<T extends State> = (updater: (state: T) => T | Partial<T>) => void;

type GetState<T extends State> = () => T;

type StateCreator<T extends State> = (set: SetState<T>, get: GetState<T>) => T;

export interface Store<T extends State> {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: (listener: () => void) => () => void;
}

export function create<T extends State>(storeCreator: StateCreator<T>): Store<T>;
