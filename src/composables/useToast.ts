import type { ToastServiceMethods } from "primevue/toastservice";
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

let toastApi: ToastServiceMethods | undefined;

/**
 * Hands PrimeVue's ToastService to `useToast`. Called once from `main.ts`.
 *
 * `primevue/usetoast` is the usual way to reach this API, but it is `inject()`
 * based and so only works during `setup()`. `apiService.handleError` toasts
 * from an axios catch block, long after setup has returned, so we take the same
 * service off the app instance instead.
 */
export const registerToastService = (service: ToastServiceMethods) => {
  toastApi = service;
};

export const useToast = () => ({
  showToast: (message: string, color: ToastColor = "danger") =>
    toastApi?.add({
      severity: SEVERITIES[color] ?? "error",
      summary: SUMMARIES[color] ?? "Error",
      detail: message,
      life: TOAST_LIFE_MS,
    }),
  dismissToast: () => toastApi?.removeAllGroups(),
});
