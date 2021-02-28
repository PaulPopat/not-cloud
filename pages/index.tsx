import { InferGetServerSidePropsType } from "next";
import { Column, Container, Row } from "../components/layout";
import React from "react";
import { Api } from "../app/api";
import { H1, List } from "../components/atoms";
import { Modal } from "../components/molecules";
import { Navbar } from "../components/constructs";
import { CreatePassword } from "../components/constructs/password/create";

export const getServerSideProps = async () => {
  return {
    props: {
      passwords: await Api.Passwords.GetAll(),
      tags: await Api.Passwords.Tags.GetAll(),
    },
  };
};

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [creating, set_creating] = React.useState(false);
  return (
    <>
      <Navbar
        brand="Passwords"
        items={[
          { click: () => set_creating(true), name: "Create a Password" },
          { click: "/passwords/tags/create", name: "Create a Tag" },
        ]}
      ></Navbar>
      <Container>
        <Row>
          <Column md="3">
            <H1>Tags</H1>
            <List>
              {props.tags.map((t) => (
                <List.Item key={t.id}>{t.name}</List.Item>
              ))}
            </List>
          </Column>
          <Column md="9">
            <H1>Passwords</H1>
            <List>
              {props.passwords.map((t) => (
                <List.Item key={t.id}>{t.name}</List.Item>
              ))}
            </List>
          </Column>
        </Row>
      </Container>
      <Modal
        show={creating}
        close={() => set_creating(false)}
        title={<>Create a Password</>}
        size="lg"
      >
        <CreatePassword tags={props.tags} />
      </Modal>
    </>
  );
}
