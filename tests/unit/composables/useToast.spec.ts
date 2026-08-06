import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ToastServiceMethods } from "primevue/toastservice";
import { registerToastService, useToast } from "@/composables/useToast";

const add = vi.fn();
const removeAllGroups = vi.fn();

const setup = () => {
  registerToastService({
    add,
    remove: vi.fn(),
    removeGroup: vi.fn(),
    removeAllGroups,
  } as ToastServiceMethods);

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

  it("dismisses all toasts", () => {
    const { dismissToast } = setup();

    dismissToast();

    expect(removeAllGroups).toHaveBeenCalled();
  });
});
