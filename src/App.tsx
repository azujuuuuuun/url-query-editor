import React from "react";
import { useTab } from "./tab";
import { useQueryParams, createNewUrl } from "./query-param";
import { useRouter } from "./router";
import "./App.css";

function App() {
  const { id: tabId, url } = useTab();
  const { queryParams, updateQueryParam, deleteQueryParam, addQueryParam } =
    useQueryParams(url);
  const router = useRouter();

  const onChangeQueryKey = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    updateQueryParam(id, "key", e.target.value);
  };

  const onChangeQueryValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    updateQueryParam(id, "value", e.target.value);
  };

  const onClickDelete = (id: string) => {
    deleteQueryParam(id);
  };

  const onClickAdd = () => {
    addQueryParam();

    window.requestAnimationFrame(() => {
      const elements = document.getElementsByName("query-key");
      elements.item(elements.length - 1)?.focus();
    });
  };

  const onClickSend = async () => {
    if (!url) {
      return;
    }

    const newUrl = createNewUrl(url, queryParams);

    await router.push(newUrl, tabId);
  };

  return (
    <div className="App">
      {queryParams.length > 0 && (
        <ul>
          {queryParams.map((p, i) => {
            const keyId = `key-${p.id}`;
            const valueId = `value-${p.id}`;
            return (
              <li key={p.id} className="list-item">
                <label className="visually-hidden" htmlFor={keyId}>
                  Key of {i + 1} row
                </label>
                <input
                  id={keyId}
                  className="input"
                  name="query-key"
                  value={p.key}
                  onChange={(e) => onChangeQueryKey(e, p.id)}
                />
                <span>=</span>
                <label className="visually-hidden" htmlFor={valueId}>
                  Value of {i + 1} row
                </label>
                <input
                  id={valueId}
                  className="input"
                  value={p.value}
                  onChange={(e) => onChangeQueryValue(e, p.id)}
                />
                <button className="button" onClick={() => onClickDelete(p.id)}>
                  Delete
                </button>
              </li>
            );
          })}
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
