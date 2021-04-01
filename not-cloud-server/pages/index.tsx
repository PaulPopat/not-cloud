import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Api } from "../app/api";
import { BuildNav } from "../app/nav";
import { Button, H1, H5, P, Small } from "../common/atoms";
import { Navbar } from "../components/navbar";
import { Column, Container, Row } from "../common/layout";
import { Card } from "../common/molecules";

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
            <Card>
              <H5>Site Settings</H5>
              <P>
                Here you can configure the domain name used for file sharing.
                More settings to come!
              </P>
              <Button.Link href="/site-settings" colour="primary">
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
            <Card>
              <H5>Download the App</H5>
              <P>
                The app can be used to sync files from your desktop to your Not
                Cloud server. The app is currently only available on Windows as
                that is the only build resources available. Plans for an Apple
                computer to build the MacOS app are in the works.
              </P>
              <Button.External
                href="/application/not-cloud-sync-setup.exe"
                colour="primary"
              >
                Download
              </Button.External>
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
