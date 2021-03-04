import Link from "next/link";
import React from "react";
import { Api } from "../../../app/api";
import { UseAsync } from "../../../util/react";
import { Icon, P, Small } from "../../atoms";
import { Column, Row } from "../../layout";

export const NCloudDocs: React.FC = ({ children }) => {
  if (!process.browser) {
    return <></>;
  }

  const [items] = UseAsync(() =>
    Api.Files.Search({ term: "+(*.ncloud|*.docx)" })
  );

  if (!items) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <Icon is="loading" width="100%" height="auto" colour="info" />
      </div>
    );
  }

  return (
    <>
      {items
        .sort((a, b) => b.edited - a.edited)
        .filter((_, i) => i < 10)
        .map((i) => (
          <Row key={i.download_url}>
            <Column>
              <P>
                <Link href={`/documents/${encodeURI(i.download_url)}`}>
                  <a>{i.name}</a>
                </Link>
                <br />
                <Small>{i.download_url}</Small>
              </P>
            </Column>
          </Row>
        ))}
    </>
  );
};
