import { watch } from "vue";
import { useToast as usePrimeVueToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";
import { useToast } from "@/composables/useToast";

const TOAST_LIFE_MS = 4000;

const SEVERITIES: Record<string, ToastMessageOptions["severity"]> = {
  primary: "info",
  success: "success",
  warning: "warn",
  danger: "error",
};

/**
 * Forwards the app-wide `useToast` state into PrimeVue's Toast queue.
 *
 * `useToast` is a plain reactive singleton so services can raise toasts from
 * outside a component (`apiService.handleError` does), while PrimeVue's own
 * `useToast` is inject-based and only works inside `setup()`. This bridge is
 * the seam between the two, and must be called once from the app root, where
 * `<Toast />` is mounted.
 */
export const useToastBridge = (): void => {
  const { toastState, dismissToast } = useToast();
  const primeVueToast = usePrimeVueToast();

  watch(
    () => toastState.id,
    () => {
      if (!toastState.isOpen) {
        return;
      }

      primeVueToast.add({
        severity: SEVERITIES[toastState.color] ?? "error",
        detail: toastState.message,
        life: TOAST_LIFE_MS,
      });

      dismissToast();
    },
  );
};
