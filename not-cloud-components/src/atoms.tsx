import React, { PropsWithChildren } from "react";
import * as BS from "./component-types";
import { LinkContext } from "./link";
import { Classes } from "./util";

export const Alert = Object.assign(
  ({ children, colour }: PropsWithChildren<{ colour: BS.ThemeColour }>) => (
    <div className={Classes("alert", `alert-${colour}`)} role="alert">
      {children}
    </div>
  ),
  {
    Link: ({ children, href }: PropsWithChildren<{ href: string }>) => {
      const Link = React.useContext(LinkContext);
      return (
        <Link href={href} className="alert-link">
          {children}
        </Link>
      );
    },
    Heading: ({ children }: PropsWithChildren<{}>) => (
      <h4 className="alert-heading">{children}</h4>
    ),
  }
);

type ButtonCommonProps = {
  colour: BS.ThemeColour;
  outline?: boolean;
  size?: BS.Size;
  disabled?: boolean;
  "no-margin"?: boolean;
};

type ButtonProps = {
  type: "button" | "submit" | "reset";
  click?: () => void;
};

type LinkButtonProps = {
  href: string;
  role?: "button";
};

function ButtonClasses(props: ButtonCommonProps) {
  return Classes("btn", {
    [`btn-${props.colour}`]: !props.outline,
    [`btn-outline-${props.colour}`]: props.outline,
    [`btn-${props.size}`]: props.size,
    disabled: props.disabled,
    "mb-3": !props["no-margin"],
  });
}

export const Button = Object.assign(
  (props: PropsWithChildren<ButtonCommonProps & ButtonProps>) => (
    <button
      type={props.type}
      className={ButtonClasses(props)}
      disabled={props.disabled || undefined}
      onClick={() => props.click && props.click()}
    >
      {props.children}
    </button>
  ),
  {
    Link: (props: PropsWithChildren<ButtonCommonProps & LinkButtonProps>) => {
      const Link = React.useContext(LinkContext);
      return (
        <Link
          href={props.href}
          className={ButtonClasses(props)}
          tabIndex={props.disabled ? -1 : 0}
          role={props.role}
          aria-disabled={props.disabled ? "true" : undefined}
        >
          {props.children}
        </Link>
      );
    },
    External: (
      props: PropsWithChildren<ButtonCommonProps & LinkButtonProps>
    ) => (
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer noopener"
        className={ButtonClasses(props)}
        tabIndex={props.disabled ? -1 : 0}
        role={props.role}
        aria-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </a>
    ),
  }
);

const Icons = {
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
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </>
  ),
  key: (
    <>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </>
  ),
  folder: (
    <>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </>
  ),
  video: (
    <>
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </>
  ),
  "file-text": (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </>
  ),
  file: (
    <>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    </>
  ),
  speaker: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <circle cx="12" cy="14" r="4"></circle>
      <line x1="12" y1="6" x2="12.01" y2="6"></line>
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </>
  ),
  loading: (
    <g
      fill="none"
      fillRule="evenodd"
      transform="translate(1 1) scale(0.44444)"
      strokeWidth="2"
    >
      <circle cx="22" cy="22" r="6" stroke-opacity="0">
        <animate
          attributeName="r"
          begin="1.5s"
          dur="3s"
          values="6;22"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-opacity"
          begin="1.5s"
          dur="3s"
          values="1;0"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-width"
          begin="1.5s"
          dur="3s"
          values="2;0"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="22" cy="22" r="6" strokeOpacity="0">
        <animate
          attributeName="r"
          begin="3s"
          dur="3s"
          values="6;22"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-opacity"
          begin="3s"
          dur="3s"
          values="1;0"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-width"
          begin="3s"
          dur="3s"
          values="2;0"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="22" cy="22" r="8">
        <animate
          attributeName="r"
          begin="0s"
          dur="1.5s"
          values="6;1;2;3;4;5;6"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  ),
};

export type IconName = keyof typeof Icons;

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

type ListGroupProps = {
  flush?: boolean;
  horizontal?: BS.Size;
};

type ListGroupItemProps = {
  active?: boolean;
  disabled?: boolean;
  action?: boolean;
  spaced?: boolean;
  colour?: BS.ThemeColour;
};

function ListItemClass(props: ListGroupItemProps) {
  return Classes("list-group-item", {
    active: props.active,
    disabled: props.disabled,
    [`list-group-item-${props.colour}`]: props.colour,
    "list-group-item-action": props.action,
    "d-flex justify-content-between align-items-center": props.spaced,
  });
}

export const List = Object.assign(
  ({ flush, horizontal, children }: PropsWithChildren<ListGroupProps>) => (
    <div
      className={Classes("list-group", "shadow-sm", "mb-3", {
        "list-group-flush": flush,
        "list-group-horizontal": horizontal === "xs",
        [`list-group-horizontal-${horizontal}`]:
          horizontal && horizontal !== "xs",
      })}
    >
      {children}
    </div>
  ),
  {
    Item: (props: PropsWithChildren<ListGroupItemProps>) => (
      <div
        className={ListItemClass(props)}
        aria-current={props.active ? "true" : undefined}
        aria-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </div>
    ),
    Button: (
      props: PropsWithChildren<ListGroupItemProps & { click: () => void }>
    ) => (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.click();
        }}
        role="button"
        className={ListItemClass(props)}
        aria-current={props.active ? "true" : undefined}
        aria-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </a>
    ),
  }
);

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

export const Transition: React.FC<{
  show: boolean;
  hidden: React.CSSProperties;
  shown: React.CSSProperties;
  time: number;
}> = ({ children, show, hidden, shown, time }) => {
  const [render, set_render] = React.useState(show);
  const [display, set_display] = React.useState(show);
  React.useEffect(() => {
    let timeout = show
      ? setTimeout(() => {
          set_render(true);
          timeout = setTimeout(() => set_display(true), 1);
        }, 1)
      : setTimeout(() => {
          set_display(false);
          timeout = setTimeout(() => set_render(false), time);
        }, 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  if (!render) {
    return <></>;
  }

  return <div style={{ ...hidden, ...(display ? shown : {}) }}>{children}</div>;
};
