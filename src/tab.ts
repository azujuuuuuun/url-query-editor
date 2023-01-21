import { useRef, useState, useEffect } from "react";
import { isExtensionMode } from "./env";

interface Tab {
  id?: number;
  url?: string;
}

export const useTab = (): Tab => {
  const id = useRef<number>();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (isExtensionMode()) {
      chrome?.tabs
        ?.query({ active: true, currentWindow: true })
        .then((tabs) => {
          const [tab] = tabs;

          id.current = tab.id;
          setUrl(tab.url);
        });
    } else {
      setUrl(window.location.href);
    }
  }, []);

  return { id: id.current, url };
};
