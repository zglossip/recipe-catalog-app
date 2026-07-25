import { reactive, readonly } from "vue";

type ToastColor = "primary" | "success" | "warning" | "danger" | string;

const toastState = reactive({
  // Bumped on every showToast so consumers still fire when the same message is
  // raised twice in a row — message/color/isOpen alone would not change.
  id: 0,
  isOpen: false,
  message: "",
  color: "danger" as ToastColor,
});

const showToast = (message: string, color: ToastColor = "danger") => {
  toastState.message = message;
  toastState.color = color;
  toastState.isOpen = true;
  toastState.id++;
};

const dismissToast = () => {
  toastState.isOpen = false;
};

export const useToast = () => ({
  toastState: readonly(toastState),
  showToast,
  dismissToast,
});
