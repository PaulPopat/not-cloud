import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ExtensionMap } from "../../../app/file-icons";
import { GetFileLink } from "../../../app/file-link";
import { FormatBytes } from "../../../util/html";
import { Icon, P } from "../../atoms";
import { Column, Row } from "../../layout";
import { Card } from "../../molecules";

export const CardView: React.FC<{
  content: {
    name: string;
    extension: string;
    type: "directory" | "file";
    created: number;
    edited: number;
    size: number;
    download_url: string;
  }[];
  set_deleting: (value: string) => void;
  set_editing: (value: string) => void;
}> = ({ content, set_deleting, set_editing }) => {
  const router = useRouter();
  return (
    <Row>
      {content
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "directory" ? -1 : 1;
          }

          const pa = a.name.toLowerCase();
          const pb = b.name.toLowerCase();
          return pa < pb ? -1 : pa > pb ? 1 : 0;
        })
        .map((c) => ({
          ...c,
          download_url: GetFileLink(c.type, c.download_url),
        }))
        .map((c) => (
          <Column xs="12" md="6" lg="4" key={c.name}>
            <Card>
              <Row>
                <Column xs="8">
                  <Card.Title>
                    <Icon
                      is={
                        c.type === "directory"
                          ? "folder"
                          : ExtensionMap[c.extension] ?? "file"
                      }
                      colour="dark"
                      width="24"
                      height="24"
                      valign="sub"
                    />{" "}
                    {c.download_url.type === "internal" ? (
                      <Link href={c.download_url.href}>
                        <a style={{ textDecoration: "none" }}>
                          {c.name + c.extension}
                        </a>
                      </Link>
                    ) : (
                      <a
                        href={c.download_url.href}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        {c.name + c.extension}
                      </a>
                    )}
                  </Card.Title>
                </Column>
                <Column xs="4">
                  <P align="end">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        set_editing(c.name + c.extension);
                      }}
                    >
                      <Icon
                        is="edit"
                        colour="dark"
                        width="24"
                        height="24"
                        valign="sub"
                      />
                    </a>
                    &nbsp;
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        set_deleting(c.download_url.original);
                      }}
                    >
                      <Icon
                        is="trash"
                        colour="dark"
                        width="24"
                        height="24"
                        valign="sub"
                      />
                    </a>
                  </P>
                </Column>
              </Row>
              <Row>
                <Column xs="4">
                  {c.type === "file" && (
                    <Card.Text>{FormatBytes(c.size)}</Card.Text>
                  )}
                </Column>
                <Column xs="8">
                  <Card.Text align="end">
                    {new Date(c.edited).toLocaleString()}
                  </Card.Text>
                </Column>
              </Row>
            </Card>
          </Column>
        ))}
    </Row>
  );
};
