import React from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";
type IconName = "eye" | "eye-off";

const Icons: { [TKey in IconName]: JSX.Element } = {
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </>
  ),
  "eye-off": (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </>
  ),
};

export const Icon: React.FC<{
  is: IconName;
  width: string;
  height: string;
  colour: BS.ThemeColour;
  valign?:
    | "baseline"
    | "bottom"
    | "middle"
    | "sub"
    | "super"
    | "text-bottom"
    | "text-top"
    | "top";
}> = ({ is, width, height, colour, valign }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    style={{ verticalAlign: valign }}
    className={Classes("svg", colour)}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Icons[is]}
  </svg>
);
