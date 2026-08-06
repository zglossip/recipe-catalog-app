import type { ToastServiceMethods } from "primevue/toastservice";
import type { ToastMessageOptions } from "primevue/toast";

const TOAST_LIFE_MS = 4000;

let toastApi: ToastServiceMethods | undefined;
const pending: ToastMessageOptions[] = [];

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
  pending.splice(0).forEach((message) => service.add(message));
};

export const useToast = () => ({
  showToast: (message: string) => {
    const options: ToastMessageOptions = {
      severity: "error",
      // `ToastMessage` always renders the summary span, and the theme puts a
      // gap between it and the detail — an omitted summary is blank space.
      summary: "Error",
      detail: message,
      life: TOAST_LIFE_MS,
    };

    // A toast can be raised before `main.ts` registers the service. Hold it
    // rather than dropping it; registration replays whatever queued up.
    if (toastApi) {
      toastApi.add(options);
    } else {
      pending.push(options);
    }
  },
  dismissToast: () => {
    pending.length = 0;
    toastApi?.removeAllGroups();
  },
});
