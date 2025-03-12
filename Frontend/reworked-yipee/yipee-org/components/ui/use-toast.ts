/* eslint-disable */

import { useEffect, useState } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToastActionElement = React.ReactElement;

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: Toast; // Includes 'id'
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<Toast> & Pick<Toast, "id">;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: Toast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.toast].slice(-TOAST_LIMIT), // Removed duplicate 'id'
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // Dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            dismissed: true,
          })),
        };
      }

      // Dismiss a specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, dismissed: true } : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;

      // Remove all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      // Remove a specific toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

export function toast({
  title,
  description,
  action,
  variant,
}: Omit<Toast, "id">) {
  const id = generateId();

  const update = (props: Partial<Omit<Toast, "id">>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      id,
      title,
      description,
      action,
      variant,
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

toast.dismiss = (toastId?: string) => {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
};

export function useToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}