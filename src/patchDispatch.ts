type Dispatch<A> = (value: A) => void;

type DispatchValue<D extends Dispatch<any>> = D extends Dispatch<infer A>
  ? A
  : never;
type DispatchCall<D extends Dispatch<any>> = [D, DispatchValue<D>];

let pendingUpdates: Array<DispatchCall<Dispatch<any>>> = [];
let nextTick: Promise<void> | null = null;

function applyUpdates(ReactDOM: any) {
  const currentPendingUpdates = pendingUpdates;
  pendingUpdates = [];
  nextTick = null;
  ReactDOM.unstable_batchedUpdates(() => {
    currentPendingUpdates.forEach(([fn, value]) => {
      fn(value);
    });
  });
}

export function patchDispatch<V>(
  dispatch: Dispatch<V>,
  ReactDOM: any,
): Dispatch<V> {
  return (value: V) => {
    pendingUpdates.push([dispatch, value]);
    if (nextTick === null) {
      nextTick = Promise.resolve().then(() => applyUpdates(ReactDOM));
    }
  };
}
