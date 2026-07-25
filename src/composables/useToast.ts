import ToastEventBus from "primevue/toasteventbus";
import type { ToastMessageOptions } from "primevue/toast";

type ToastColor = "primary" | "success" | "warning" | "danger" | string;

const TOAST_LIFE_MS = 4000;

const SEVERITIES: Record<string, ToastMessageOptions["severity"]> = {
  primary: "info",
  success: "success",
  warning: "warn",
  danger: "error",
};

/**
 * Raises toasts on PrimeVue's Toast queue.
 *
 * `ToastEventBus` is a module-level singleton that `<Toast />` subscribes to
 * directly, so this works outside a component — which it has to, because
 * `apiService.handleError` and the form services call it from plain functions.
 * PrimeVue's own inject-based `useToast` would require a `setup()` context.
 * `<Toast />` is mounted once in `App.vue`.
 */
export const useToast = () => ({
  showToast: (message: string, color: ToastColor = "danger") =>
    ToastEventBus.emit("add", {
      severity: SEVERITIES[color] ?? "error",
      detail: message,
      life: TOAST_LIFE_MS,
    }),
  dismissToast: () => ToastEventBus.emit("remove-all-groups"),
});
