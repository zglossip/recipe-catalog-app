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

vi.mock("@/services/apiService");
vi.mock("vue-router");
vi.mock("@/composables/usePageRefresher", () => ({
  usePageRefresher: () => {},
}));

const defaultInstructionsResponse = {
  recipeId: 5,
  instructions: ["Mix", "Bake"],
};

const setup = (
  response = defaultInstructionsResponse,
): { service: EditInstructionsService; routerGo: () => void } => {
  vi.resetAllMocks();

  const routerGo = vi.fn();

  (useRouter as Mock).mockReturnValue({ go: routerGo });
  (saveInstructions as Mock).mockResolvedValue({
    ok: true,
    data: null,
  } satisfies ApiResult<null>);
  (fetchInstructions as Mock).mockResolvedValue({
    ok: true,
    data: response,
  } satisfies ApiResult<typeof response>);

  const service = useEditInstructionService(
    defaultInstructionsResponse.recipeId,
  );

  return { service, routerGo };
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

    service.onSaveClick();

    expect(saveInstructions as Mock).toHaveBeenCalledWith({
      recipeId: defaultInstructionsResponse.recipeId,
      instructions: service.instructions.value,
    });
    expect(routerGo).toHaveBeenCalledWith(-1);
  });

  it("cancels editing by going back", () => {
    const { service, routerGo } = setup();

    service.onCancelClick();

    expect(routerGo).toHaveBeenCalledWith(-1);
  });
});
