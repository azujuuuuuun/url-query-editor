import { useState, useEffect } from "react";
import { uuid } from "./lib";

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

export const getQueryParams = (url: string) => {
  const urlObj = new URL(url);
  const params: QueryParam[] = [];
  urlObj.searchParams.sort();
  urlObj.searchParams.forEach((value, key) => {
    params.push({ id: uuid(), key, value });
  });
  return params;
};

export const useQueryParams = (url?: string) => {
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);

  const updateQueryParam = (
    id: string,
    target: "key" | "value",
    value: string,
  ) => {
    setQueryParams((prev) =>
      prev.map((param) => {
        if (param.id === id) {
          return { ...param, [target]: value };
        }
        return param;
      }),
    );
  };

  const deleteQueryParam = (id: string) => {
    setQueryParams((prev) => prev.filter((param) => param.id !== id));
  };

  const addQueryParam = () => {
    setQueryParams((prev) => prev.concat([{ id: uuid(), key: "", value: "" }]));
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
      .reduce((prev, cur) => ({ ...prev, [cur.key]: cur.value }), {}),
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
