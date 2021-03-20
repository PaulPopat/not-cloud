import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ExtensionMap } from "../../app/file-extensions";
import { GetFileLink } from "../../app/file-link";
import { FormatBytes } from "../../common/util";
import { Icon } from "../../common/atoms";
import { Column, Row } from "../../common/layout";
import { CardActions } from "./file-actions";

export const TableView: React.FC<{
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
      <Column>
        <table className="table">
          <thead>
            <tr>
              <td scope="col" width="50"></td>
              <td scope="col">Name</td>
              <td scope="col" width="150">
                Size
              </td>
              <td scope="col" width="200">
                Last Edited
              </td>
              <td scope="col" width="100"></td>
            </tr>
          </thead>
          <tbody>
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
                <tr key={c.name}>
                  <td>
                    <Icon
                      is={
                        c.type === "directory"
                          ? "folder"
                          : ExtensionMap(c.extension) ?? "file"
                      }
                      colour="dark"
                      width="20"
                      height="20"
                      valign="sub"
                    />
                  </td>
                  <td>
                    {c.detailed_download_url.type === "internal" ? (
                      <Link href={c.detailed_download_url.href}>
                        <a>{c.name + c.extension}</a>
                      </Link>
                    ) : (
                      <a href={c.detailed_download_url.href} target="_blank">
                        {c.name + c.extension}
                      </a>
                    )}
                  </td>
                  <td>{c.type === "directory" ? "" : FormatBytes(c.size)}</td>
                  <td>{new Date(c.edited).toLocaleString()}</td>
                  <td>
                    <CardActions file={c} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Column>
    </Row>
  );
};
