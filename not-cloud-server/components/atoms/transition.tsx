import React from "react";

export const Transition: React.FC<{
  show: boolean;
  hidden: React.CSSProperties;
  shown: React.CSSProperties;
  time: number;
}> = ({ children, show, hidden, shown, time }) => {
  const [render, set_render] = React.useState(show);
  const [display, set_display] = React.useState(show);
  React.useEffect(() => {
    let timeout = show
      ? setTimeout(() => {
          set_render(true);
          timeout = setTimeout(() => set_display(true), 1);
        }, 1)
      : setTimeout(() => {
          set_display(false);
          timeout = setTimeout(() => set_render(false), time);
        }, 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  if (!render) {
    return <></>;
  }

  return <div style={{ ...hidden, ...(display ? shown : {}) }}>{children}</div>;
};
