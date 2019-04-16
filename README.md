# batched-hook

Batched set state and dispatch for react hooks

## Problem

Sometimes state updates caused by multiple calls to useState setter, are not batched. [more detail][react-14259]

Example:

```jsx
function useCount(init = 0) {
  const [count, setCounter] = useState(init);
  function inc() {
    setCounter(c => c + 1);
  }
  return [count, inc];
}

export function App() {
  const [a, incA] = useCount(0);
  const [b, incB] = useCount(0);
  const renderCount = useRef(0);

  renderCount.current = renderCount.current + 1;
  console.log(`render${renderCount.current}`, a, b);

  useEffect(() => {
    console.log('effect ', a, b);
  }, [a, b]);

  const incAll = () => {
    setTimeout(() => {
      incA();
      incB();
    }, 0);
  };

  return (
    <div className="App">
      render count:
      <div data-testid="count">{renderCount.current}</div>
      state:
      <div data-testid="state">
        {a}-{b}
      </div>
      <button data-testid="button" onClick={incAll}>
        increment all
      </button>
    </div>
  );
}
```

output:

```
render1 0 0
effect  0 0
// click
render2 1 0  <-- bad render
effect  1 0  <-- bad effect
render3 1 1
effect  1 1
```

## Solution

with `batched-hook` you can batch calls to `dispatch` of `useReducer` and setter of `useState` hooks.

```
render1 0 0
effect  0 0
// click
render2 1 1
effect  1 1
```

## Install

```
yarn add batched-hook
```

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { install } from 'batched-hook';

// `uninstall` function will restore default React behavior.
const uninstall = install(React, ReactDOM);
```

## How it works

`install` function patches React and replace `useState` and `useReducer` with new functions. These functions have the
same functionality but when you call `dispatch`, the called function and its arguments will be saved into a queue. after
all sync statements, all function calls inside the queue we will be called inside `ReactDOM.unstable_batchedUpdates`.

[react-14259]: https://github.com/facebook/react/issues/14259
