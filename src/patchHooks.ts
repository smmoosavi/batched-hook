import { patchDispatch } from './patchDispatch';

function patchHook(hook: any, ReactDOM: any): any {
  return (...args: any[]): any => {
    const [state, dispatch] = hook(...args);
    return [state, patchDispatch(dispatch, ReactDOM)];
  };
}

let installed = false;

export function install(React: any, ReactDOM: any) {
  if (installed) {
    throw new Error('Batched hook already installed');
  }
  installed = true;
  const ReactUseState = React.useState;
  const ReactUseReducer = React.useReducer;

  React.useState = patchHook(ReactUseState, ReactDOM);
  React.useReducer = patchHook(ReactUseReducer, ReactDOM);

  return function uninstall() {
    if (!installed) {
      throw new Error('Batched hook was not installed');
    }
    installed = false;
    React.useState = ReactUseState;
    React.useReducer = ReactUseReducer;
  };
}
