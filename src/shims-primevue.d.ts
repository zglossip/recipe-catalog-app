/**
 * `primevue/toasteventbus` is a published entry point that PrimeVue's own
 * ToastService is built on, but it ships no declarations. Typed here rather
 * than as bare `any` so `useToast` still gets checked at the call site.
 */
declare module "primevue/toasteventbus" {
  type ToastEventHandler = (payload?: unknown) => void;

  const ToastEventBus: {
    emit: (event: string, payload?: unknown) => void;
    on: (event: string, handler: ToastEventHandler) => void;
    off: (event: string, handler: ToastEventHandler) => void;
  };

  export default ToastEventBus;
}
