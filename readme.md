# Storio

A lightweight, efficient state management solution for React applications with zero dependencies beyond React itself. Storio provides a simple and intuitive API for managing global state without the complexity of contexts or additional dependencies.

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
  const count = useCounter((state) => state.count);
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
  const isMobile = dimensionsStore();
  
  return (
    <div>
      {isMobile() ? 'Mobile View' : 'Desktop View'}
    </div>
  );
}
```

## Performance

Storio is built with performance in mind:

1. **Selective Re-rendering**: Components only re-render when their selected state changes, not on every state update
2. **Deep Equality Checks**: Prevents unnecessary re-renders by performing deep equality comparisons on state changes
3. **Fine-grained Updates**: Use selectors to subscribe to specific parts of the state

## API Reference

### `create(storeCreator)`

Creates a new store with the given initial state and actions.

- `storeCreator`: Function that receives `set` and returns the initial state and actions
- Returns a hook that can be used to access the store state and actions

### Store Hook

The created hook provides several features:

- **State Selection**: `const value = useStore((state) => state.value)`
- **Action Access**: `const { setValue } = useStore()`
- **Direct State Access**: `useStore.getState()`
- **State Updates**: `useStore.setState(newState)`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT