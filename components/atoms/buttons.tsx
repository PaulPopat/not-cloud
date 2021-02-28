import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

type ButtonCommonProps = {
  colour: BS.ThemeColour;
  outline?: boolean;
  size?: BS.Size;
  disabled?: boolean;
};

type ButtonProps = {
  type: "button" | "submit" | "reset";
  click?: () => void;
};

type LinkButtonProps = {
  href: string;
  role?: "button";
};

function ButtonClasses(props: ButtonCommonProps) {
  return Classes("btn", {
    [`btn-${props.colour}`]: !props.outline,
    [`btn-outline-${props.colour}`]: props.outline,
    [`btn-${props.size}`]: props.size,
    disabled: props.disabled,
  });
}

export const Button = Object.assign(
  (props: PropsWithChildren<ButtonCommonProps & ButtonProps>) => (
    <button
      type={props.type}
      className={ButtonClasses(props)}
      disabled={props.disabled || undefined}
      onClick={() => props.click && props.click()}
    >
      {props.children}
    </button>
  ),
  {
    Link: (props: PropsWithChildren<ButtonCommonProps & LinkButtonProps>) => (
      <Link href={props.href}>
        <a
          className={ButtonClasses(props)}
          tabIndex={props.disabled ? -1 : 0}
          role={props.role}
          aria-disabled={props.disabled ? "true" : undefined}
        >
          {props.children}
        </a>
      </Link>
    ),
    External: (
      props: PropsWithChildren<ButtonCommonProps & LinkButtonProps>
    ) => (
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer noopener"
        className={ButtonClasses(props)}
        tabIndex={props.disabled ? -1 : 0}
        role={props.role}
        aria-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </a>
    ),
  }
);
