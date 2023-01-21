/**
 * @vitest-environment jsdom
 */
import { vi, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { isExtensionMode } from "./env";
import { useTab } from "./tab";

vi.mock("./env", () => {
  return {
    isExtensionMode: vi.fn(),
  };
});

const chromeMock = {
  tabs: {
    query: vi.fn(),
  },
};

vi.stubGlobal("chrome", chromeMock);

describe("useTab", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test("extension mode", async () => {
    (isExtensionMode as Mock).mockReturnValueOnce(true);
    chromeMock.tabs.query.mockResolvedValueOnce([
      { id: 1, url: "https://example.com" },
    ]);

    const { result } = renderHook(() => useTab());

    await waitFor(() => {
      expect(isExtensionMode).toHaveBeenCalled();
      expect(result.current.id).toBe(1);
      expect(result.current.url).toBe("https://example.com");
    });
  });

  test("not extension mode", () => {
    (isExtensionMode as Mock).mockReturnValueOnce(false);

    const { result } = renderHook(() => useTab());

    expect(isExtensionMode).toHaveBeenCalled();
    expect(result.current.id).toBeUndefined();
    expect(result.current.url).toBe("http://localhost:3000/");
  });
});
