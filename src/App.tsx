import React, { useEffect, useRef } from "react";
import { useTab } from "./tab";
import { useQueryParams, createNewUrl } from "./query-param";
import { useRouter } from "./router";
import "./App.css";

const selectors = {
  focusable: "input, button",
  queryKey: '[name="query-key"]',
  queryValue: '[name="query-value"]',
  delete: ".list-item > .button",
  add: ".button-group > .button:nth-child(1)",
  send: ".button-group > .button:nth-child(2)",
};

function App() {
  const { id: tabId, url } = useTab();
  const { queryParams, updateQueryParam, deleteQueryParam, addQueryParam } =
    useQueryParams(url);
  const router = useRouter();

  const focusElement = (selector: string, index: number) => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.item(index)?.focus();
  };

  const focusPrev = () => {
    const focusableElements = document.querySelectorAll<HTMLElement>(
      selectors.focusable
    );

    let activeIndex = -1;
    for (var i = 0; i < focusableElements.length; i++) {
      if (focusableElements[i] === document.activeElement) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex !== -1) {
      const prevIndex =
        (activeIndex - 1 + focusableElements.length) % focusableElements.length;
      focusableElements[prevIndex].focus();
    }
  };

  const focusNext = () => {
    const focusableElements = document.querySelectorAll<HTMLElement>(
      selectors.focusable
    );

    let activeIndex = -1;
    for (let i = 0; i < focusableElements.length; i++) {
      if (focusableElements[i] === document.activeElement) {
        activeIndex = i;
      }
    }

    if (activeIndex !== -1) {
      const nextIndex = (activeIndex + 1) % focusableElements.length;
      focusableElements[nextIndex].focus();
    }
  };

  const onChangeQueryKey = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    updateQueryParam(id, "key", e.target.value);
  };

  const onKeyDownQueryKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.shiftKey) {
      return;
    }
    if (e.key === "ArrowUp") {
      if (index === 0) {
        focusElement(selectors.delete, queryParams.length - 1);
      } else {
        focusElement(selectors.queryKey, index - 1);
      }
    }
    if (e.key === "ArrowRight") {
      focusNext();
    }
    if (e.key === "ArrowDown") {
      if (index === queryParams.length - 1) {
        focusElement(selectors.add, 0);
      } else {
        focusElement(selectors.queryKey, index + 1);
      }
    }
    if (e.key === "ArrowLeft") {
      focusPrev();
    }
  };

  const onChangeQueryValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    updateQueryParam(id, "value", e.target.value);
  };

  const onKeyDownQueryValue = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.shiftKey) {
      return;
    }
    if (e.key === "ArrowUp") {
      if (index === 0) {
        focusElement(selectors.add, 0);
      } else {
        focusElement(selectors.queryValue, index - 1);
      }
    }
    if (e.key === "ArrowRight") {
      focusNext();
    }
    if (e.key === "ArrowDown") {
      if (index === queryParams.length - 1) {
        focusElement(selectors.send, 0);
      } else {
        focusElement(selectors.queryValue, index + 1);
      }
    }
    if (e.key === "ArrowLeft") {
      focusPrev();
    }
  };

  const onClickDelete = (id: string) => {
    deleteQueryParam(id);
  };

  const onKeyDownDelete = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (!e.shiftKey) {
      return;
    }
    if (e.key === "ArrowUp") {
      if (index === 0) {
        focusElement(selectors.send, 0);
      } else {
        focusElement(selectors.delete, index - 1);
      }
    }
    if (e.key === "ArrowRight") {
      focusNext();
    }
    if (e.key === "ArrowDown") {
      if (index === queryParams.length - 1) {
        focusElement(selectors.queryKey, 0);
      } else {
        focusElement(selectors.delete, index + 1);
      }
    }
    if (e.key === "ArrowLeft") {
      focusPrev();
    }
  };

  const onClickAdd = () => {
    addQueryParam();

    window.requestAnimationFrame(() => {
      const elements = document.getElementsByName("query-key");
      elements.item(elements.length - 1)?.focus();
    });
  };

  const onKeyDownAdd = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!e.shiftKey) {
      return;
    }
    if (e.key === "ArrowUp") {
      focusElement(selectors.queryKey, queryParams.length - 1);
    }
    if (e.key === "ArrowRight") {
      focusNext();
    }
    if (e.key === "ArrowDown") {
      focusElement(selectors.queryValue, 0);
    }
    if (e.key === "ArrowLeft") {
      focusPrev();
    }
  };

  const onClickSend = async () => {
    if (!url) {
      return;
    }

    const newUrl = createNewUrl(url, queryParams);

    await router.push(newUrl, tabId);
  };

  const onKeyDownSend = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!e.shiftKey) {
      return;
    }
    if (e.key === "ArrowUp") {
      focusElement(selectors.queryValue, queryParams.length - 1);
    }
    if (e.key === "ArrowRight") {
      focusNext();
    }
    if (e.key === "ArrowDown") {
      focusElement(selectors.delete, 0);
    }
    if (e.key === "ArrowLeft") {
      focusPrev();
    }
  };

  const addFuncRef = useRef<Function>();
  useEffect(() => {
    addFuncRef.current = onClickAdd;
  }, [onClickAdd]);

  const sendFuncRef = useRef<Function>();
  useEffect(() => {
    sendFuncRef.current = onClickSend;
  }, [onClickSend]);

  const rendered = useRef(false);
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }

    const onKeyDown = async (e: any) => {
      if (e.key === "+" && e.target?.nodeName !== "INPUT") {
        addFuncRef.current?.();
      }
      if (e.shiftKey && e.key === "Enter") {
        await sendFuncRef.current?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.addEventListener("keydown", onKeyDown);
    };
  }, []);

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
                  onKeyDown={(e) => onKeyDownQueryKey(e, i)}
                />
                <span>=</span>
                <label className="visually-hidden" htmlFor={valueId}>
                  Value of {i + 1} row
                </label>
                <input
                  id={valueId}
                  className="input"
                  name="query-value"
                  value={p.value}
                  onChange={(e) => onChangeQueryValue(e, p.id)}
                  onKeyDown={(e) => onKeyDownQueryValue(e, i)}
                />
                <button
                  className="button"
                  onClick={() => onClickDelete(p.id)}
                  onKeyDown={(e) => onKeyDownDelete(e, i)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="button-group">
        <button
          className="button"
          onClick={onClickAdd}
          onKeyDown={onKeyDownAdd}
        >
          Add
        </button>
        <button
          className="button"
          onClick={onClickSend}
          onKeyDown={onKeyDownSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
