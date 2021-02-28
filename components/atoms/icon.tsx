import React from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";
type IconName = "eye" | "eye-off" | "minus-circle" | "plus-circle" | "edit";

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
  "minus-circle": (
    <>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </>
  ),
  "plus-circle": (
    <>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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
