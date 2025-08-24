import { Action, State, Toast, ToasterToast } from "./toast-types";
import { genId, reducer } from "./toast-utils";

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

export function dispatch(action: Action): void {
  memoryState = reducer(memoryState, action, dispatch);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

export function addListener(listener: (state: State) => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

export function getMemoryState(): State {
  return memoryState;
}

export function toast({ ...props }: Toast): {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
} {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}