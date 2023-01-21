import { getQueryParams, createNewUrl } from "./query-param";

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
