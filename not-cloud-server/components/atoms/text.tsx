import React from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

export const H1: React.FC = ({ children }) => (
  <h1 className="mt-4 mb-3">{children}</h1>
);

export const H2: React.FC = ({ children }) => (
  <h2 className="mt-3 mb-4">{children}</h2>
);

export const H5: React.FC = ({ children }) => (
  <h5 className="mt-1 mb-2">{children}</h5>
);

export const P: React.FC<{ align?: BS.Align }> = ({ children, align }) => (
  <p className={Classes("mb-3", { [`text-${align}`]: align })}>{children}</p>
);

export const Small: React.FC = ({ children }) => (
  <small className="text-muted">{children}</small>
);
