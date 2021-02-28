import React from "react";
import { Classes } from "../util/html";
import * as BS from "./types";

type ContainerProps = { size?: BS.SimpleSize };
export const Container: React.FC<ContainerProps> = ({ size, children }) => (
  <div
    className={Classes({
      container: !size,
      ["container-" + size]: size,
    })}
  >
    {children}
  </div>
);

export const Row: React.FC = ({ children }) => (
  <div className="row">{children}</div>
);

type ColumnProps = { [TKey in BS.Size]?: BS.Column };
export const Column: React.FC<ColumnProps> = (props) => (
  <div
    className={Classes({
      col: !props.xs,
      ["col-" + props.xs]: props.xs,
      ["col-sm-" + props.sm]: props.sm,
      ["col-md-" + props.md]: props.md,
      ["col-lg-" + props.lg]: props.lg,
      ["col-xl-" + props.xl]: props.xl,
      ["col-xxl-" + props.xxl]: props.xxl,
    })}
  >
    {props.children}
  </div>
);
