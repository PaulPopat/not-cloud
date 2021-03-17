import React from "react";
import { LoadScript } from "../common/html";

export const CKEditor: React.FC<{
  content: string;
  set_content: (value: string) => void;
}> = ({ content, set_content }) => {
  if (!process.browser) {
    return <></>;
  }

  const editor_ref = React.useRef<HTMLDivElement>(null);
  const toolbar_ref = React.useRef<HTMLDivElement>(null);
  const [instance, set_instance] = React.useState<CKEditor>();
  React.useEffect(() => {
    const editor_el = editor_ref.current;
    const toolbar_el = toolbar_ref.current;
    if (!editor_el || !toolbar_el) {
      return;
    }

    (async () => {
      if (!(window as any).DecoupledEditor) {
        await LoadScript("/api/ckeditor");
      }

      const editor = await DecoupledEditor.create(editor_el);
      set_instance(editor);
      toolbar_el.appendChild(editor.ui.view.toolbar.element);
      editor.setData(content);
      editor.model.document.on("change:data", () => {
        set_content(editor.getData());
      });
    })();
  }, [true]);

  React.useEffect(() => {
    if (instance && content !== instance.getData()) {
      instance.setData(content);
    }
  }, [content]);

  return (
    <div className="document-editor">
      <div className="document-editor__toolbar" ref={toolbar_ref}></div>
      <div className="document-editor__editable-container">
        <div className="document-editor__editable" ref={editor_ref} />
      </div>
    </div>
  );
};
