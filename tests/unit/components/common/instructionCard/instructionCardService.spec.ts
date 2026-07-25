import { describe, it, expect, vi, Mock } from "vitest";

vi.mock("@/services/apiService");

import {
  InstructionCardService,
  useInstructionCardService,
} from "@/components/viewRecipe/instructionCard/instructionCardService";
import { ApiResult, fetchInstructions } from "@/services/apiService";

interface SetupOptions {
  recipeId?: number;
  editEmit?: () => void;
  fetchInstructions?: () => Promise<ApiResult<{ instructions: string[] }>>;
}

interface TestSetup {
  service: InstructionCardService;
  recipeId: number;
  editEmit: () => void;
  fetchInstructions: () => Promise<ApiResult<{ instructions: string[] }>>;
}

const setup = (options: SetupOptions = {}): TestSetup => {
  const {
    recipeId = 100,
    editEmit = vi.fn(),
    fetchInstructions: fetchInstructionsMock = vi.fn().mockResolvedValue({
      ok: true,
      data: { instructions: [] },
    } satisfies ApiResult<{ instructions: string[] }>),
  } = options;

  (fetchInstructions as Mock).mockImplementation(fetchInstructionsMock);

  const service = useInstructionCardService(recipeId, editEmit);

  return {
    service,
    recipeId,
    editEmit,
    fetchInstructions: fetchInstructionsMock,
  };
};

describe("instructionCardService", () => {
  it("loads instructions on load", async () => {
    const instructions = ["step 1", "step 2"];
    const { service } = setup({
      fetchInstructions: vi.fn().mockResolvedValue({
        ok: true,
        data: { instructions },
      } satisfies ApiResult<{ instructions: string[] }>),
    });

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    expect(service.instructions.value).toEqual(instructions);
  });
});
