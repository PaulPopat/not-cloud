export type SimpleSize = "sm" | "md" | "lg" | "xl" | "xxl";
export type Size = "xs" | SimpleSize;
export type Column =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "auto";

export type ThemeColour =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

export type ImageModel = {
  src: string;
  alt: string;
};
