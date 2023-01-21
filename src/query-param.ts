import { useState, useEffect } from "react";

interface QueryParam {
  key: string;
  value: string;
}

export const getQueryParams = (url: string) => {
  const urlObj = new URL(url);
  const params: QueryParam[] = [];
  urlObj.searchParams.sort();
  urlObj.searchParams.forEach((value, key) => {
    params.push({ key, value });
  });
  return params;
};

export const useQueryParams = (url?: string) => {
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);

  const updateQueryParam = (
    index: number,
    target: "key" | "value",
    value: string
  ) => {
    setQueryParams((prev) =>
      prev.map((param, i) => {
        if (i === index) {
          return { ...param, [target]: value };
        }
        return param;
      })
    );
  };

  const deleteQueryParam = (index: number) => {
    setQueryParams((prev) => prev.filter((_, i) => i !== index));
  };

  const addQueryParam = () => {
    setQueryParams((prev) => prev.concat([{ key: "", value: "" }]));
  };

  useEffect(() => {
    if (url) {
      const params = getQueryParams(url);
      setQueryParams(params);
    }
  }, [url]);

  return {
    queryParams,
    updateQueryParam,
    deleteQueryParam,
    addQueryParam,
  };
};

export const createNewUrl = (url: string, queryParams: QueryParam[]) => {
  const urlObj = new URL(url);

  const urlSearchParams = new URLSearchParams(
    queryParams
      .filter((p) => p.key.trim())
      .reduce((prev, cur) => ({ ...prev, [cur.key]: cur.value }), {})
  );
  const search = urlSearchParams.toString()
    ? `?${urlSearchParams.toString()}`
    : "";

  return (
    urlObj.href.replace(urlObj.search, "").replace(urlObj.hash, "") +
    search +
    urlObj.hash
  );
};
