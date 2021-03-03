import React, { PropsWithChildren } from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

type ListGroupProps = {
  flush?: boolean;
  horizontal?: BS.Size;
};

type ListGroupItemProps = {
  active?: boolean;
  disabled?: boolean;
  action?: boolean;
  spaced?: boolean;
  colour?: BS.ThemeColour;
};

function ListItemClass(props: ListGroupItemProps) {
  return Classes("list-group-item", {
    active: props.active,
    disabled: props.disabled,
    [`list-group-item-${props.colour}`]: props.colour,
    "list-group-item-action": props.action,
    "d-flex justify-content-between align-items-center": props.spaced,
  });
}

export const List = Object.assign(
  ({ flush, horizontal, children }: PropsWithChildren<ListGroupProps>) => (
    <div
      className={Classes("list-group", "shadow-sm", "mb-3", {
        "list-group-flush": flush,
        "list-group-horizontal": horizontal === "xs",
        [`list-group-horizontal-${horizontal}`]:
          horizontal && horizontal !== "xs",
      })}
    >
      {children}
    </div>
  ),
  {
    Item: (props: PropsWithChildren<ListGroupItemProps>) => (
      <div
        className={ListItemClass(props)}
        aria-current={props.active ? "true" : undefined}
        aria-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </div>
    ),
    Button: (
      props: PropsWithChildren<ListGroupItemProps & { click: () => void }>
    ) => (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.click();
        }}
        role="button"
        className={ListItemClass(props)}
        aria-current={props.active ? "true" : undefined}
        aria-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </a>
    ),
  }
);
