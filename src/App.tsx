import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const tabId = useRef<number>();
  const initialUrl = useRef<URL>();
  const [queryParams, setQueryParams] = useState<
    { key: string; value: string }[]
  >([]);

  const onChangeQueryKey = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setQueryParams((prev) =>
      prev.map((param, i) => {
        if (i === index) {
          return { key: e.target.value, value: param.value };
        }
        return param;
      })
    );
  };

  const onChangeQueryValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setQueryParams((prev) =>
      prev.map((param, i) => {
        if (i === index) {
          return { key: param.key, value: e.target.value };
        }
        return param;
      })
    );
  };

  const onClickDelete = (index: number) => {
    setQueryParams((prev) => prev.filter((_, i) => i !== index));
  };

  const onClickAdd = () => {
    setQueryParams((prev) => prev.concat([{ key: "", value: "" }]));
  };

  const onClickSend = async () => {
    if (!tabId.current || !initialUrl.current) {
      return;
    }

    const { hash, href, search } = initialUrl.current;
    const newSearchParams = new URLSearchParams(
      queryParams
        .filter((p) => p.key)
        .reduce((prev, cur) => ({ ...prev, [cur.key]: cur.value }), {})
    );
    const newSearch = newSearchParams.toString() ? `?${newSearchParams}` : "";
    const newUrl =
      href.replace(search, "").replace(hash, "") + newSearch + hash;

    await chrome?.scripting?.executeScript({
      target: {
        tabId: tabId.current,
      },
      // @ts-ignore
      func: (url: string) => {
        window.location.href = url;
      },
      args: [newUrl],
    });

    window.close();
  };

  useEffect(() => {
    chrome?.tabs?.query({ active: true }).then((tabs) => {
      const [tab] = tabs;

      if (!tab.id || !tab.url) {
        return;
      }

      const url = new URL(tab.url);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      tabId.current = tab.id;
      initialUrl.current = url;
      setQueryParams(params);
    });
  }, []);

  return (
    <div className="App">
      {queryParams.length > 0 && (
        <ul>
          {queryParams.map((p, i) => (
            <li key={i} className="list-item">
              <input
                className="input"
                value={p.key}
                onChange={(e) => onChangeQueryKey(e, i)}
              />
              <span>=</span>
              <input
                className="input"
                value={p.value}
                onChange={(e) => onChangeQueryValue(e, i)}
              />
              <button className="button" onClick={() => onClickDelete(i)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="button-group">
        <button className="button" onClick={onClickAdd}>
          Add
        </button>
        <button className="button" onClick={onClickSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
