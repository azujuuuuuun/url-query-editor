/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { getQueryParams, useQueryParams, createNewUrl } from "./query-param";

describe("getQueryParams", () => {
  const testCases: [string, string, { key: string; value: string }[]][] = [
    ["with no query param", "https://example.com", []],
    ["with one param", "https://example.com?a=b", [{ key: "a", value: "b" }]],
    [
      "with unsorted key params",
      "https://example.com?b=a&a=b",
      [
        { key: "a", value: "b" },
        { key: "b", value: "a" },
      ],
    ],
  ];

  test.each(testCases)("%s", (name, url, expected) => {
    expect(getQueryParams(url)).toEqual(expected);
  });
});

describe("useQueryParams", () => {
  test("state with no url", () => {
    const { result } = renderHook(() => useQueryParams());

    expect(result.current.queryParams).toEqual([]);
  });

  test("state with url", () => {
    const { result } = renderHook(() =>
      useQueryParams("https://example.com?a=b")
    );

    expect(result.current.queryParams).toEqual([{ key: "a", value: "b" }]);
  });

  describe("updateQueryParam", () => {
    test("update key", () => {
      const { result } = renderHook(() =>
        useQueryParams("https://example.com?a=b")
      );

      act(() => {
        result.current.updateQueryParam(0, "key", "key");
      });

      expect(result.current.queryParams).toEqual([{ key: "key", value: "b" }]);
    });

    test("update value", () => {
      const { result } = renderHook(() =>
        useQueryParams("https://example.com?a=b")
      );

      act(() => {
        result.current.updateQueryParam(0, "value", "value");
      });

      expect(result.current.queryParams).toEqual([
        { key: "a", value: "value" },
      ]);
    });
  });

  test("deleteQueryParam", () => {
    const { result } = renderHook(() =>
      useQueryParams("https://example.com?a=b")
    );

    act(() => {
      result.current.deleteQueryParam(0);
    });

    expect(result.current.queryParams).toEqual([]);
  });

  test("addQueryParam", () => {
    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.addQueryParam();
    });

    expect(result.current.queryParams).toEqual([{ key: "", value: "" }]);
  });
});

describe("createNewUrl", () => {
  const testCases: [
    string,
    string,
    { key: string; value: string }[],
    string
  ][] = [
    [
      "with falsy key",
      "https://example.com?a=b",
      [{ key: " ", value: "value" }],
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
        { key: "b", value: "a" },
        { key: "a", value: "b" },
      ],
      "https://example.com/?b=a&a=b",
    ],
  ];

  test.each(testCases)("%s", (name, url, queryParams, expected) => {
    expect(createNewUrl(url, queryParams)).toEqual(expected);
  });
});
