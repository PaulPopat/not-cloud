import React, { PropsWithChildren } from "react";
import * as BS from "../types";

type CardProps = {
  image?: BS.ImageModel;
};

export const Card = Object.assign(
  ({ children, image }: PropsWithChildren<CardProps>) => (
    <div className="card">
      {image && (
        <img src={image.src} className="card-img-top" alt={image.alt} />
      )}
      <div className="card-body">{children}</div>
    </div>
  ),
  {
    Title: ({ children }: PropsWithChildren<{}>) => (
      <h5 className="card-title">{children}</h5>
    ),
    Text: ({ children }: PropsWithChildren<{}>) => (
      <p className="card-text">{children}</p>
    ),
    Subtitle: ({ children }: PropsWithChildren<{}>) => (
      <h6 className="card-subtitle mb-2 text-muted">{children}</h6>
    ),
  }
);
