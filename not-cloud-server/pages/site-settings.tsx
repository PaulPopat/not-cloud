import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import { Api } from "../app/api";
import { BuildNav } from "../app/nav";
import { Button, P } from "../common/atoms";
import { CreateForm, Field } from "../common/form";
import { Column, Container, Row } from "../common/layout";
import { AlertContext } from "../components/alert-context";
import { Navbar } from "../components/navbar";

export const getServerSideProps = async () => {
  return {
    props: await Api.Settings.Get(),
  };
};

const Form = CreateForm({
  domain: Field(""),
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { alert } = React.useContext(AlertContext);
  const [form, set_form] = React.useState({
    domain: Field(props.domain ?? ""),
  });
  return (
    <>
      <Head>
        <title>Site Settings | Not Cloud</title>
      </Head>
      <Navbar items={BuildNav([])} />
      <Form
        form={form}
        set_form={set_form}
        submit={async (f) => {
          try {
            Assert(IsObject({ domain: IsString }), f);
            await Api.Settings.Update(f);
            alert(<>Successfully updated your site settings.</>, "success");
          } catch {
            alert(
              <>
                Failed to update your settings. If this persists then please
                raise an issue on GitHub
              </>,
              "danger"
            );
          }
        }}
      >
        <Container>
          <Row>
            <Column xs="12" md="6">
              <Form.Text for={(f) => f.domain} autocomplete="off">
                Domain Name
              </Form.Text>
              <P>
                This is used for file sharing. It allows the site to give you a
                useful sharing link that you can pass on to someone else.
              </P>
              <P>
                This will not actually configure the domain for you. Make sure
                you correctly set up the domain records for yourself of enter
                your IP address in here. All files will be shared on port 80.
              </P>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button type="submit" colour="primary">
                Submit
              </Button>
            </Column>
          </Row>
        </Container>
      </Form>
    </>
  );
}
