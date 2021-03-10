import React from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

export const ProgressBar: React.FC<{
  value: number;
  max: number;
  colour: BS.ThemeColour;
  striped?: boolean;
}> = ({ value, max, colour, striped, children }) => (
  <div className="progress mt-1 mb-3">
    <div
      className={Classes("progress-bar", {
        [`bg-${colour}`]: colour,
        "progress-bar-striped": striped,
      })}
      role="progressbar"
      style={{ width: `${(value / max) * 100}%` }}
      aria-valuenow={value}
      aria-valuemin={value}
      aria-valuemax={max}
    >
      {children}
    </div>
  </div>
);
