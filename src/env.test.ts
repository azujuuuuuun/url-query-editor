import { vi } from "vitest";
import { isExtensionMode } from "./env";

describe("isExtensionMode", () => {
  test("MODE extension", () => {
    vi.stubEnv("MODE", "extension");

    expect(isExtensionMode()).toBeTruthy();
  });

  test("MODE development", () => {
    vi.stubEnv("MODE", "development");

    expect(isExtensionMode()).toBeFalsy();
  });
});
