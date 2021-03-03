import Head from "next/head";
import React from "react";
import { BuildNav } from "../app/nav";
import { Button, H1, H5, P } from "../components/atoms";
import { Navbar } from "../components/constructs";
import { Column, Container, Row } from "../components/layout";
import { Card } from "../components/molecules";

export default function Page() {
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
              <P>Document editor for your cloud files</P>
              <Button.Link href="/documents" colour="primary" disabled>
                Coming soon
              </Button.Link>
            </Card>
          </Column>
        </Row>
      </Container>
    </>
  );
}
