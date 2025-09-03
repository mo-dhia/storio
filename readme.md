# Storio

A lightweight, efficient state management solution for React with zero dependencies beyond React itself. Storio gives you the simplicity of Zustand with the predictability of useSyncExternalStore, without providers, contexts, or boilerplate.

Why choose Storio over Zustand or Redux?

- ⚖️ Zero overhead: No providers, no context, no middleware layer — just a tiny hook-based store
- 🧩 Drop‑in simplicity: API mirrors the mental model of Zustand’s create, but even smaller
- ⚡ Selective re-renders: Components only update when the selected slice changes
- 🔍 Deep equality guard: Built-in deep comparison prevents unnecessary updates out of the box
- 🧠 Predictable by design: Powered by useSyncExternalStore for React‑official subscription semantics and SSR safety
- 📦 Zero dependencies: Only react as a peer dependency

## Features

- 🪶 **Lightweight**: Minimal implementation using React's built-in hooks
- ⚡ **Efficient**: Components re-render only when their selected state changes
- 🎯 **Targeted Updates**: Fine-grained control over component re-renders
- 🔄 **Simple API**: Intuitive interface for state management
- 📦 **Zero Dependencies**: Only requires React as a peer dependency
- 🎨 **Flexible**: Support for both simple and complex state patterns

## Installation

```bash
npm install storio
# or
pnpm add storio
# or
yarn add storio
```

## Basic Usage

Here's a simple counter example that demonstrates the basic usage of Storio:

```jsx
import { create } from 'storio';

// Create a store with initial state and actions
const useCounter = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));

// Use the store in your component
function Counter() {
  const {count} = useCounter();
  const { increment, decrement } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## Advanced Usage

Storio supports more complex state patterns with custom selectors and computed values. Here's an example of a responsive dimensions store:

```jsx
import { create } from 'storio';

export const dimensionsStore = create((set) => ({
    vw: 0,
    setVw: (width) => set({ vw: width }),
    
    // Computed values using store state
    isMobile: () => {
        const { vw } = dimensionsStore.getState();
        return vw <= 480;
    },
    isTablet: () => {
        const { vw } = dimensionsStore.getState();
        return vw > 480 && vw <= 1024;
    },
    isDesktop: () => {
        const { vw } = dimensionsStore.getState();
        return vw >= 1024;
    }
}));

// Usage in components
function ResponsiveComponent() {
  const { isMobile } = dimensionsStore();
  
  return (
    <div>
      { isMobile() ? 'Mobile View' : 'Desktop View' }
    </div>
  );
}
```

Pattern: Expose computed helpers on the store and destructure them in components for clarity and reuse. Alternatively, you can select primitives with a selector if you prefer returning a boolean directly.

### Storio vs Zustand vs Redux (quick comparison)

| Criteria | Storio | Zustand | Redux Toolkit |
|---|---|---|---|
| Provider required | No | No | Yes (`<Provider>`) |
| Dependencies | React peer only | `zustand` | `@reduxjs/toolkit`, `react-redux` |
| API surface | Tiny | Small | Larger |
| Boilerplate | None | Low | Medium |
| Selective re-render | Yes (selector) | Yes (selector) | Yes (`useSelector`) |
| Equality logic | Deep equality built-in | Shallow/ref equality by default | Custom via `useSelector` |
| DevTools | Manual integration | Via middleware | Built-in DevTools |
| Middleware | Not needed for basics | Optional addons | First-class |
| SSR-safe | Yes (`useSyncExternalStore`) | Yes | Yes |
| Learning curve | Very low | Low | Medium |

If you want the smallest, most readable solution without sacrificing control, Storio is a great fit. If you need time‑travel debugging or a middleware ecosystem out‑of‑the‑box, Redux Toolkit remains excellent.

## Performance

Storio is built with performance in mind:

1. **Selective Re-rendering**: Components only re-render when their selected state changes, not on every state update
2. **Deep Equality Checks**: Prevents unnecessary re-renders by performing deep equality comparisons on state changes
3. **Fine-grained Updates**: Use selectors to subscribe to specific parts of the state

## API Reference

### `create(storeCreator)`

Creates a new store with the given initial state and actions.

- `storeCreator`: function that receives `(set, get)` and returns the initial state and actions
- Returns a hook that can be used to access the store state and actions

### Store Hook

The created hook provides several features:

- **State Selection**: `const value = useStore((state) => state.value)`
- **Action Access**: `const { setValue } = useStore()`
- **Direct State Access**: `useStore.getState()`
- **State Updates**: `useStore.setState(nextOrUpdater)`
- **Subscription**: `useStore.subscribe(listener)`

SSR: Storio uses `useSyncExternalStore` under the hood, providing correct server and client semantics without extra configuration.

### Migration

#### From Zustand

Most stores migrate by changing the import. If your store only uses `set`, it’s a pure drop‑in.

```jsx
// Before
import { create } from 'zustand';

const useCounter = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));

// After
import { create } from 'storio';

const useCounter = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

If you used Zustand’s `get`, Storio exposes it as the second argument to `create((set, get) => ...)` and also via `useStore.getState()`.

#### From Redux / RTK

Replace slices and reducers with a small store and explicit actions. No provider needed.

```jsx
// Instead of slice + reducers
import { create } from 'storio';

export const useTodos = create((set, get) => ({
  items: [],
  add: (title) => set((s) => ({ items: [...s.items, { id: Date.now(), title }] })),
  remove: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

function TodoList() {
  const items = useTodos((s) => s.items);
  const { add, remove } = useTodos();
  // ...
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT