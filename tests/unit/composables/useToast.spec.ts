import { beforeEach, describe, expect, it } from "vitest";
import { useToast } from "@/composables/useToast";

const resetToast = () => {
  const { showToast, dismissToast } = useToast();
  showToast("", "danger");
  dismissToast();
};

describe("useToast", () => {
  beforeEach(() => {
    resetToast();
  });

  it("opens with a default danger color", () => {
    const { toastState, showToast } = useToast();

    showToast("Something went wrong");

    expect(toastState.isOpen).toBe(true);
    expect(toastState.message).toBe("Something went wrong");
    expect(toastState.color).toBe("danger");
  });

  it("opens with a provided color", () => {
    const { toastState, showToast } = useToast();

    showToast("Looks good", "success");

    expect(toastState.isOpen).toBe(true);
    expect(toastState.message).toBe("Looks good");
    expect(toastState.color).toBe("success");
  });

  it("bumps the id for each toast, including repeats", () => {
    const { toastState, showToast } = useToast();

    showToast("Same message");
    const firstId = toastState.id;
    showToast("Same message");

    expect(toastState.id).toBe(firstId + 1);
  });

  it("dismisses the toast", () => {
    const { toastState, showToast, dismissToast } = useToast();

    showToast("Close me", "warning");
    dismissToast();

    expect(toastState.isOpen).toBe(false);
  });
});
