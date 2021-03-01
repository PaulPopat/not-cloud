import Link from "next/link";
import React, { PropsWithChildren } from "react";

export const Breadcrumbs = Object.assign(
  ({ children }: PropsWithChildren<{}>) => (
    <nav
      style={
        {
          "--bs-breadcrumb-divider":
            "url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;)",
        } as any
      }
      aria-label="breadcrumb"
    >
      <ol className="breadcrumb">{children}</ol>
    </nav>
  ),
  {
    Item: ({ href, children }: PropsWithChildren<{ href: string }>) => (
      <li className="breadcrumb-item">
        <Link href={href}>
          <a>{children}</a>
        </Link>
      </li>
    ),
    This: ({ children }: PropsWithChildren<{}>) => (
      <li className="breadcrumb-item active" aria-current="page">
        {children}
      </li>
    ),
  }
);
