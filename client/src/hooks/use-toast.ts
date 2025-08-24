import * as React from "react";
import { dispatch, addListener, getMemoryState, toast } from "./toast-store";

function useToast() {
  const [state, setState] = React.useState(getMemoryState());

  React.useEffect(() => {
    const removeListener = addListener(setState);
    return removeListener;
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };

// Re-export types for backward compatibility
export type { Toast, ToasterToast, State } from "./toast-types";
