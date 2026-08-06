import type { ToastServiceMethods } from "primevue/toastservice";

const TOAST_LIFE_MS = 4000;

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
  showToast: (message: string) =>
    toastApi?.add({
      severity: "error",
      // `ToastMessage` always renders the summary span, and the theme puts a
      // gap between it and the detail — an omitted summary is blank space.
      summary: "Error",
      detail: message,
      life: TOAST_LIFE_MS,
    }),
  dismissToast: () => toastApi?.removeAllGroups(),
});
