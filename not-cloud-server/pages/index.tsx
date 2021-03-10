import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Api } from "../app/api";
import { BuildNav } from "../app/nav";
import { Button, H1, H5, P, Small } from "../components/atoms";
import { Navbar } from "../components/constructs";
import { Column, Container, Row } from "../components/layout";
import { Card } from "../components/molecules";

export const getServerSideProps = async () => {
  return {
    props: {
      documents: await Api.Files.Search({ term: "*.ncloud" }),
    },
  };
};

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <>
      <Head>
        <title>Not Cloud</title>
      </Head>
      <Navbar items={BuildNav([])} />
      <Container>
        <Row>
          <Column>
            <H1>Welcome to Not Cloud</H1>
            <P>Your personal cloud that is not in the cloud.</P>
            <div className="mb-5" />
          </Column>
        </Row>
        <Row>
          <Column xs="12" md="6" lg="4">
            <Card>
              <H5>Passwords</H5>
              <P>
                Your password vault to manage and access your login details.
              </P>
              <Button.Link href="/passwords" colour="primary">
                Access
              </Button.Link>
            </Card>
          </Column>
          <Column xs="12" md="6" lg="4">
            <Card>
              <H5>Files</H5>
              <P>Cloud storage on your personal server.</P>
              <Button.Link href="/files" colour="primary">
                Access
              </Button.Link>
            </Card>
          </Column>
          <Column xs="12" md="6" lg="4">
            <Card>
              <H5>Docs</H5>
              {props.documents
                .sort((a, b) => b.edited - a.edited)
                .filter((_, i) => i < 5)
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
            </Card>
          </Column>
        </Row>
      </Container>
    </>
  );
}