import { isExtensionMode } from "./env";

interface Router {
  push: (url: string, tabId?: number) => Promise<void>;
}

const extensionRouter: Router = {
  push: async (url: string, tabId?: number) => {
    if (!tabId) {
      return;
    }

    await chrome?.scripting?.executeScript({
      target: {
        tabId,
      },
      // @ts-ignore
      func: (url: string) => {
        window.location.href = url;
      },
      args: [url],
    });

    window.close();
  },
};

const router: Router = {
  push: (url: string) => {
    return new Promise((resolve) => {
      window.location.href = url;
      resolve();
    });
  },
};

export const useRouter = (): Router => {
  if (isExtensionMode()) {
    return extensionRouter;
  }
  return router;
};
