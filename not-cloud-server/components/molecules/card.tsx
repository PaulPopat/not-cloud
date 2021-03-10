import React, { PropsWithChildren } from "react";
import { Classes } from "../../util/html";
import * as BS from "../types";

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
