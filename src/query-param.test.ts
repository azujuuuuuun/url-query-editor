/**
 * @vitest-environment jsdom
 */
import { Mock, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { getQueryParams, useQueryParams, createNewUrl } from "./query-param";
import { uuid } from "./lib";

vi.mock("./lib", () => ({
  uuid: vi.fn(),
}));

describe("getQueryParams", () => {
  beforeEach(() => {
    (uuid as Mock).mockReturnValue("1");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases: [
    string,
    string,
    { id: string; key: string; value: string }[],
    number,
  ][] = [
    ["with no query param", "https://example.com", [], 0],
    [
      "with one param",
      "https://example.com?a=b",
      [{ id: "1", key: "a", value: "b" }],
      1,
    ],
    [
      "with unsorted key params",
      "https://example.com?b=a&a=b",
      [
        { id: "1", key: "a", value: "b" },
        { id: "1", key: "b", value: "a" },
      ],
      2,
    ],
  ];

  test.each(testCases)("%s", (name, url, expected, times) => {
    expect(getQueryParams(url)).toEqual(expected);
    expect(uuid).toHaveBeenCalledTimes(times);
  });
});

describe("useQueryParams", () => {
  beforeEach(() => {
    (uuid as Mock).mockReturnValue("1");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("state with no url", () => {
    const { result } = renderHook(() => useQueryParams());

    expect(result.current.queryParams).toEqual([]);
  });

  test("state with url", () => {
    const { result } = renderHook(() =>
      useQueryParams("https://example.com?a=b"),
    );

    expect(result.current.queryParams).toEqual([
      { id: "1", key: "a", value: "b" },
    ]);
    expect(uuid).toHaveBeenCalledTimes(1);
  });

  describe("updateQueryParam", () => {
    test("update key", () => {
      const { result } = renderHook(() =>
        useQueryParams("https://example.com?a=b"),
      );

      act(() => {
        result.current.updateQueryParam("1", "key", "key");
      });

      expect(result.current.queryParams).toEqual([
        { id: "1", key: "key", value: "b" },
      ]);
    });

    test("update value", () => {
      const { result } = renderHook(() =>
        useQueryParams("https://example.com?a=b"),
      );

      act(() => {
        result.current.updateQueryParam("1", "value", "value");
      });

      expect(result.current.queryParams).toEqual([
        { id: "1", key: "a", value: "value" },
      ]);
    });
  });

  test("deleteQueryParam", () => {
    const { result } = renderHook(() =>
      useQueryParams("https://example.com?a=b"),
    );

    act(() => {
      result.current.deleteQueryParam("1");
    });

    expect(result.current.queryParams).toEqual([]);
  });

  test("addQueryParam", () => {
    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.addQueryParam();
    });

    expect(result.current.queryParams).toEqual([
      { id: "1", key: "", value: "" },
    ]);
    expect(uuid).toHaveBeenCalledTimes(1);
  });
});

describe("createNewUrl", () => {
  const testCases: [
    string,
    string,
    { id: string; key: string; value: string }[],
    string,
  ][] = [
    [
      "with falsy key",
      "https://example.com?a=b",
      [{ id: "1", key: " ", value: "value" }],
      "https://example.com/",
    ],
    [
      "with no query param",
      "https://example.com?a=b",
      [],
      "https://example.com/",
    ],
    ["with hash", "https://example.com#hash", [], "https://example.com/#hash"],
    [
      "with query params",
      "https://example.com",
      [
        { id: "1", key: "b", value: "a" },
        { id: "1", key: "a", value: "b" },
      ],
      "https://example.com/?b=a&a=b",
    ],
  ];

  test.each(testCases)("%s", (name, url, queryParams, expected) => {
    expect(createNewUrl(url, queryParams)).toEqual(expected);
  });
});
