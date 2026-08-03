import { describe, it, expect, vi, Mock } from "vitest";
import {
  useEditInstructionService,
  EditInstructionsService,
} from "@/components/createEdit/editInstructionsForm/editInstructionsService";
import {
  ApiResult,
  fetchInstructions,
  saveInstructions,
} from "@/services/apiService";
import { useRouter } from "vue-router";
import { InstructionList } from "@/types/InstructionList";

const { showToast } = vi.hoisted(() => ({ showToast: vi.fn() }));

vi.mock("@/services/apiService");
vi.mock("vue-router");
vi.mock("@/composables/useToast", () => ({
  useToast: () => ({ showToast, dismissToast: vi.fn() }),
}));

const defaultInstructionsResponse: InstructionList = {
  recipeId: 5,
  instructions: ["Mix", "Bake"],
};

const setup = (
  fetchResult: ApiResult<InstructionList> = {
    ok: true,
    data: defaultInstructionsResponse,
  },
): {
  service: EditInstructionsService;
  routerGo: () => void;
  showToast: Mock;
} => {
  vi.resetAllMocks();

  const routerGo = vi.fn();

  (useRouter as Mock).mockReturnValue({ go: routerGo });
  (saveInstructions as Mock).mockResolvedValue({
    ok: true,
    data: null,
  } satisfies ApiResult<null>);
  (fetchInstructions as Mock).mockResolvedValue(fetchResult);

  const service = useEditInstructionService(
    defaultInstructionsResponse.recipeId,
  );

  return { service, routerGo, showToast };
};

describe("editInstructionsService", () => {
  it("loads instructions on creation", async () => {
    const { service } = setup();

    await vi.waitFor(() => expect(service.instructions.value.length).toBe(2));

    expect(fetchInstructions as Mock).toHaveBeenCalledWith(5);
    expect(service.instructions.value).toEqual(["Mix", "Bake"]);
  });

  it("saves instructions and navigates back", async () => {
    const { service, routerGo } = setup();
    await vi.waitFor(() => expect(service.instructions.value.length).toBe(2));

    await service.onSaveClick();

    expect(saveInstructions as Mock).toHaveBeenCalledWith({
      recipeId: defaultInstructionsResponse.recipeId,
      instructions: service.instructions.value,
    });
    expect(routerGo).toHaveBeenCalledWith(-1);
  });

  it("toasts and flags the load when fetching instructions fails", async () => {
    const { service, showToast } = setup({ ok: false, error: "Boom" });

    await vi.waitFor(() => expect(service.loadFailed.value).toBe(true));

    expect(showToast).toHaveBeenCalledWith("Unable to load instructions: Boom");
    expect(service.instructions.value).toEqual([]);
  });

  it("refuses to save over a list that never loaded", async () => {
    const { service, routerGo, showToast } = setup({
      ok: false,
      error: "Boom",
    });

    await vi.waitFor(() => expect(service.loadFailed.value).toBe(true));
    showToast.mockClear();

    await service.onSaveClick();

    expect(saveInstructions as Mock).not.toHaveBeenCalled();
    expect(routerGo).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Instructions could not be loaded, so they cannot be saved. Reload and try again.",
    );
  });

  it("cancels editing by going back", () => {
    const { service, routerGo } = setup();

    service.onCancelClick();

    expect(routerGo).toHaveBeenCalledWith(-1);
  });
});
