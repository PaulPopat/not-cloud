import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ExtensionMap } from "../../app/file-extensions";
import { GetFileLink } from "../../app/file-link";
import { FormatBytes } from "../../common/util";
import { Icon, Small } from "../../common/atoms";
import { Column, Row } from "../../common/layout";
import { Card } from "../../common/molecules";
import { CardActions } from "./file-actions";

export const CardView: React.FC<{
  content: {
    name: string;
    extension: string;
    type: "directory" | "file";
    created: number;
    edited: number;
    size: number;
    download_url: string;
    shared: boolean;
  }[];
}> = ({ content }) => {
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
          detailed_download_url: GetFileLink(c.type, c.download_url),
        }))
        .map((c) => (
          <Column xs="12" md="6" lg="4" key={c.name}>
            <Card>
              <Row>
                <Column xs="12" space>
                  <Card.Title>
                    <Icon
                      is={
                        c.type === "directory"
                          ? "folder"
                          : ExtensionMap(c.extension) ?? "file"
                      }
                      colour="dark"
                      width="24"
                      height="24"
                      valign="sub"
                    />{" "}
                    {c.detailed_download_url.type === "internal" ? (
                      <Link href={c.detailed_download_url.href}>
                        <a>{c.name}</a>
                      </Link>
                    ) : (
                      <a href={c.detailed_download_url.href} target="_blank">
                        {c.name}
                      </a>
                    )}
                    <Small>{c.extension}</Small>
                  </Card.Title>
                  {c.type === "file" && (
                    <Card.Text align="end">{FormatBytes(c.size)}</Card.Text>
                  )}
                </Column>
              </Row>
              <Row>
                <Column xs="4">
                  <CardActions file={c} />
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
