declare type CKEditor = {
  setData(data: string): void;
  getData();
  model: {
    document: {
      on(event: "change:data", handler: () => void): void;
    };
  };
  ui: {
    view: {
      toolbar: {
        element: HTMLElement;
      };
    };
  };
};

declare const DecoupledEditor: {
  create(
    element: HTMLElement,
    options?: {
      fontFamily?: {
        options?: string[];
      };
      toolbar?: string[];
    }
  ): Promise<CKEditor>;
};
