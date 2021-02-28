import React, { PropsWithChildren } from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

type ListGroupProps = {
  flush?: boolean;
  horizontal?: BS.Size;
};
const ListInternal: React.FC<ListGroupProps> = ({
  flush,
  horizontal,
  children,
}) => (
  <ul
    className={Classes("list-group", {
      "list-group-flush": flush,
      "list-group-horizontal": horizontal === "xs",
      [`list-group-horizontal-${horizontal}`]:
        horizontal && horizontal !== "xs",
    })}
  >
    {children}
  </ul>
);

type ListGroupItemProps = {
  active?: boolean;
  disabled?: boolean;
  action?: boolean;
  spaced?: boolean;
  colour?: BS.ThemeColour;
};

export const List = Object.assign(ListInternal, {
  Item: ({
    active,
    disabled,
    action,
    colour,
    spaced,
    children,
  }: PropsWithChildren<ListGroupItemProps>) => (
    <li
      className={Classes("list-group-item", {
        active: active,
        disabled: disabled,
        [`list-group-item-${colour}`]: colour,
        "list-group-item-action": action,
        "d-flex justify-content-between align-items-center": spaced,
      })}
      aria-current={active ? "true" : undefined}
      aria-disabled={disabled ? "true" : undefined}
    >
      {children}
    </li>
  ),
});
