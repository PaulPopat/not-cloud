import { Assert, IsString } from "@paulpopat/safe-type";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Api } from "../app/api";
import { ExtensionMap } from "../app/file-icons";
import { GetFileLink } from "../app/file-link";
import { BuildNav } from "../app/nav";
import { Icon, Small } from "../components/atoms";
import { CreateForm, Field, Navbar } from "../components/constructs";
import { Column, Container, Row } from "../components/layout";
import { Card } from "../components/molecules";
import { FormatBytes } from "../util/html";
import { Unpromise } from "../util/types";

type Props = {
  content: Unpromise<ReturnType<typeof Api["Files"]["Search"]>>;
  term: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const term = context.query?.term;
  Assert(IsString, term);

  return {
    props: {
      content: await Api.Files.Search({ term }),
      term,
    },
  };
};

const Search = CreateForm({
  term: Field(""),
});

export default function Page(props: Props) {
  const [search, set_search] = React.useState({ term: Field(props.term) });
  const router = useRouter();

  return (
    <>
      <Navbar items={BuildNav([])}>
        <Search
          form={search}
          set_form={set_search}
          submit={(f) => {
            router.push(`/search?term=${encodeURIComponent(f.term)}`);
          }}
        >
          <Search.InlineText
            for={(s) => s.term}
            autocomplete="off"
            placeholder="Search"
          />
        </Search>
      </Navbar>
      <Container>
        {" "}
        <Row>
          {props.content
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
              <Column xs="12" md="6" lg="4" key={c.download_url.original}>
                <Card>
                  <Row>
                    <Column xs="12" space>
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
                            <a>{c.name}</a>
                          </Link>
                        ) : (
                          <a href={c.download_url.href} target="_blank">
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
                    <Column xs="12">
                      <Small>{c.download_url.original}</Small>
                    </Column>
                  </Row>
                </Card>
              </Column>
            ))}
        </Row>
      </Container>
    </>
  );
}
