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

// `ToastMessage` always renders the summary span, and the theme puts a gap
// between it and the detail — an omitted summary shows up as blank space.
const SUMMARIES: Record<string, string> = {
  primary: "Info",
  success: "Success",
  warning: "Warning",
  danger: "Error",
};

/**
 * Raises toasts on PrimeVue's Toast queue. `ToastEventBus` is a module-level
 * singleton that the `<Toast />` in `App.vue` subscribes to directly, so this
 * works outside a component — which it has to, because `apiService.handleError`
 * calls it from a plain function. PrimeVue's inject-based `useToast` would
 * require a `setup()` context.
 */
export const useToast = () => ({
  showToast: (message: string, color: ToastColor = "danger") =>
    ToastEventBus.emit("add", {
      severity: SEVERITIES[color] ?? "error",
      summary: SUMMARIES[color] ?? "Error",
      detail: message,
      life: TOAST_LIFE_MS,
    }),
  dismissToast: () => ToastEventBus.emit("remove-all-groups"),
});
