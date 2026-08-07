import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ToastServiceMethods } from "primevue/toastservice";
import { registerToastService, useToast } from "@/composables/useToast";

const add = vi.fn();
const removeAllGroups = vi.fn();

const stubService = () =>
  ({
    add,
    remove: vi.fn(),
    removeGroup: vi.fn(),
    removeAllGroups,
  }) as ToastServiceMethods;

const setup = () => {
  registerToastService(stubService());

  return useToast();
};

describe("useToast", () => {
  beforeEach(() => {
    add.mockReset();
    removeAllGroups.mockReset();
  });

  it("adds a toast", () => {
    const { showToast } = setup();

    showToast("Something went wrong");

    expect(add).toHaveBeenCalledWith({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong",
      life: 4000,
    });
  });

  it("queues each call, including exact repeats", () => {
    const { showToast } = setup();

    showToast("Same message");
    showToast("Same message");

    expect(add).toHaveBeenCalledTimes(2);
  });

  it("holds a toast raised before the service is registered", async () => {
    vi.resetModules();
    const toast = await import("@/composables/useToast");

    toast.useToast().showToast("Raised too early");

    expect(add).not.toHaveBeenCalled();

    toast.registerToastService(stubService());

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ detail: "Raised too early" }),
    );
  });

  it("dismisses all toasts", () => {
    const { dismissToast } = setup();

    dismissToast();

    expect(removeAllGroups).toHaveBeenCalled();
  });

  it("drops held toasts on dismiss", async () => {
    vi.resetModules();
    const toast = await import("@/composables/useToast");
    const { showToast, dismissToast } = toast.useToast();

    showToast("Raised too early");
    dismissToast();
    toast.registerToastService(stubService());

    expect(add).not.toHaveBeenCalled();
  });
});
