import React from "react";
import * as BS from "./types";

export const AlertContext = React.createContext({
  alert: (html: JSX.Element, type: BS.ThemeColour) => {},
});
