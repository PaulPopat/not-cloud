import React, { PropsWithChildren } from "react";
import { LinkContext } from "./link";
import { Classes } from "./util";
import * as BS from "./component-types";

export const Breadcrumbs = Object.assign(
  ({ children }: PropsWithChildren<{}>) => (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">{children}</ol>
    </nav>
  ),
  {
    Item: ({ href, children }: PropsWithChildren<{ href: string }>) => {
      const Link = React.useContext(LinkContext);
      return (
        <li className="breadcrumb-item" style={{ cursor: "pointer" }}>
          <Link href={href}>{children}</Link>
        </li>
      );
    },
    This: ({ children }: PropsWithChildren<{}>) => (
      <li className="breadcrumb-item active" aria-current="page">
        {children}
      </li>
    ),
  }
);

type CardProps = {
  image?: BS.ImageModel;
};

export const Card = Object.assign(
  ({ children, image }: PropsWithChildren<CardProps>) => (
    <div className="card mb-3 shadow-sm">
      {image && (
        <img src={image.src} className="card-img-top" alt={image.alt} />
      )}
      <div className="card-body">{children}</div>
    </div>
  ),
  {
    Title: ({ children }: PropsWithChildren<{}>) => (
      <h5 className="card-title mb-3">{children}</h5>
    ),
    Text: ({ children, align }: PropsWithChildren<{ align?: BS.Align }>) => (
      <p className={Classes("card-text", "mb-3", { [`text-${align}`]: align })}>
        {children}
      </p>
    ),
    Subtitle: ({ children }: PropsWithChildren<{}>) => (
      <h6 className="card-subtitle mb-2 text-muted">{children}</h6>
    ),
  }
);

export const Modal: React.FC<{
  show: boolean;
  close: () => void;
  title: JSX.Element;
  footer?: JSX.Element;
  scrollable?: boolean;
  centred?: boolean;
  size?: "xl" | "lg" | "sm";
}> = ({ show, close, title, children, footer, scrollable, centred, size }) => (
  <div
    className={Classes("modal", "fade", { show })}
    tabIndex={show ? undefined : -1}
    style={{
      display: show ? "block" : "none",
      background: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <div
      className={Classes("modal-dialog", {
        "modal-dialog-scrollable": scrollable,
        "modal-dialog-centered": centred,
        [`modal-${size}`]: size,
      })}
    >
      <div className="modal-content">
        <div className="modal-header bg-light">
          <h5 className="modal-title">{title}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => close()}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer bg-light">{footer}</div>}
      </div>
    </div>
  </div>
);

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
