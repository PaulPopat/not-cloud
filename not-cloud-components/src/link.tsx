import React from "react";

export const LinkContext = React.createContext(
  (
    props: React.PropsWithChildren<{
      href: string;
      className?: string;
      tabIndex?: number;
      role?: string;
      "aria-disabled"?: boolean | "true" | "false";
    }>
  ) => (
    <a
      href={props.href}
      className={props.className}
      tabIndex={props.tabIndex}
      role={props.role}
      aria-disabled={props["aria-disabled"]}
    >
      {props.children}
    </a>
  )
);
