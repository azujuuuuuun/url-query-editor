/**
 * @vitest-environment jsdom
 */
import { vi, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { isExtensionMode } from "./env";
import { useTab } from "./tab";

vi.mock("./env", () => {
  return {
    isExtensionMode: vi.fn(),
  };
});

describe("useTab", () => {
  test("not extension mode", () => {
    (isExtensionMode as Mock).mockReturnValueOnce(false);

    const { result } = renderHook(() => useTab());

    expect(isExtensionMode).toHaveBeenCalled();
    expect(result.current.id).toBeUndefined();
    expect(result.current.url).toBe("http://localhost:3000/");
  });
});
