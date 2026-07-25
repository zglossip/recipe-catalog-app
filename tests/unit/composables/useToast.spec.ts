import { beforeEach, describe, expect, it, vi } from "vitest";

const { emit } = vi.hoisted(() => ({ emit: vi.fn() }));

vi.mock("primevue/toasteventbus", () => ({
  default: { emit },
}));

import { useToast } from "@/composables/useToast";

describe("useToast", () => {
  beforeEach(() => {
    emit.mockReset();
  });

  it("queues a toast with a default danger severity", () => {
    const { showToast } = useToast();

    showToast("Something went wrong");

    expect(emit).toHaveBeenCalledWith("add", {
      severity: "error",
      detail: "Something went wrong",
      life: 4000,
    });
  });

  it("maps a provided color to a PrimeVue severity", () => {
    const { showToast } = useToast();

    showToast("Looks good", "success");

    expect(emit).toHaveBeenCalledWith("add", {
      severity: "success",
      detail: "Looks good",
      life: 4000,
    });
  });

  it("falls back to error for an unknown color", () => {
    const { showToast } = useToast();

    showToast("Odd color", "chartreuse");

    expect(emit).toHaveBeenCalledWith(
      "add",
      expect.objectContaining({ severity: "error" }),
    );
  });

  it("queues each call, including exact repeats", () => {
    const { showToast } = useToast();

    showToast("Same message");
    showToast("Same message");

    expect(emit).toHaveBeenCalledTimes(2);
  });

  it("dismisses all toasts", () => {
    const { dismissToast } = useToast();

    dismissToast();

    expect(emit).toHaveBeenCalledWith("remove-all-groups");
  });
});
