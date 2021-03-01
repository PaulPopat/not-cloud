import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

export const Alert = Object.assign(
  ({ children, colour }: PropsWithChildren<{ colour: BS.ThemeColour }>) => (
    <div className={Classes("alert", `alert-${colour}`)} role="alert">
      {children}
    </div>
  ),
  {
    Link: ({ children, href }: PropsWithChildren<{ href: string }>) => (
      <Link href={href}>
        <a className="alert-link">{children}</a>
      </Link>
    ),
    Heading: ({ children }: PropsWithChildren<{}>) => (
      <h4 className="alert-heading">{children}</h4>
    ),
  }
);
