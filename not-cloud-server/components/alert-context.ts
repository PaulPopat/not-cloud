import React from "react";
import * as BS from "../common/component-types";

export const AlertContext = React.createContext({
  alert: (html: JSX.Element, type: BS.ThemeColour) => {},
});
