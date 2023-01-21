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
    index: number
  ) => {
    updateQueryParam(index, "key", e.target.value);
  };

  const onChangeQueryValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    updateQueryParam(index, "value", e.target.value);
  };

  const onClickDelete = (index: number) => {
    deleteQueryParam(index);
  };

  const onClickAdd = () => {
    addQueryParam();
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
