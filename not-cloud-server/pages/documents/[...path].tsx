import React from "react";
import { IsArray, IsString } from "@paulpopat/safe-type";
import { GetServerSideProps } from "next";
import { Api } from "../../app/api";
import { CKEditor } from "../../components/constructs/ckeditor";
import { Column, Row, Container } from "../../components/layout";
import { Button, H1 } from "../../components/atoms";
import { Breadcrumbs } from "../../components/molecules";
import { Navbar } from "../../components/constructs";
import { BuildNav } from "../../app/nav";
import Head from "next/head";
import { AlertContext } from "../../components/alert-context";
import { jsPDF as Pdf } from "jspdf";

type Props =
  | {
      content: string;
      save_to: string;
      parts: string[];
      name: string;
    }
  | {};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const path = context.params?.path;
  const location = IsArray(IsString)(path) ? path.join("/") : path ?? "";
  const save_to = location.replace(".docx", ".ncloud");
  const parts = save_to.split("/");
  try {
    const response = await Api.Files.NCloudFile.Get({ path: location });

    return {
      props: {
        content: response.data,
        save_to,
        parts: parts.slice(0, parts.length - 1),
        name: parts[parts.length - 1],
      },
    };
  } catch (err) {
    context.res.statusCode = 302;
    context.res.setHeader(
      "Location",
      "/" + ["files", ...parts.slice(0, parts.length - 1)].join("/")
    );
    return { props: {} };
  }
};

function IsHandler(event: KeyboardEvent) {
  if (window.navigator.platform.match("Mac")) {
    return event.metaKey;
  }

  return event.ctrlKey;
}

export default function Page(props: Props) {
  if (!("content" in props)) {
    return <></>;
  }

  const { alert } = React.useContext(AlertContext);
  const [content, set_content] = React.useState(props.content);

  const save = async () => {
    try {
      await Api.Files.NCloudFile.Write(
        { path: props.save_to },
        { data: content }
      );
      alert(<>Saved to drive</>, "success");
    } catch (e) {
      console.error(e);
      alert(<>Failed to save to drive. See console for error.</>, "danger");
    }
  };

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== "s" || !IsHandler(event)) {
        return;
      }

      event.preventDefault();
      save();
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  });

  return (
    <>
      <Head>
        <title>Document | Not Cloud</title>
      </Head>
      <Navbar items={BuildNav([])} />
      <Container>
        <Row>
          <Column>
            <H1>{props.name}</H1>
          </Column>
        </Row>
        <Row>
          <Column>
            <Breadcrumbs>
              <Breadcrumbs.Item href={"/files"}>Home</Breadcrumbs.Item>
              {props.parts.map((b, i, items) => (
                <Breadcrumbs.Item
                  key={b}
                  href={"/files/" + items.slice(0, i + 1).join("/")}
                >
                  {b}
                </Breadcrumbs.Item>
              ))}
            </Breadcrumbs>
          </Column>
        </Row>
        <Row>
          <Column>
            <CKEditor content={content} set_content={set_content} />
          </Column>
        </Row>
        <Row>
          <Column>
            <Button type="button" colour="primary" click={save}>
              Save
            </Button>
            &nbsp;
            <Button
              click={async () => {
                await save();
                const doc = new Pdf();
                await doc.html(
                  `<html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body {
                      font: 16px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif;
                    }
              
                    p {
                      font-size: 1em;
                      line-height: 1.63em;
                      padding-top: 0.5em;
                      margin-bottom: 1.13em;
                    }
              
                    h1 {
                      font-weight: 400;
                    }
              
                    h2 {
                      font-size: 2.18em;
                      font-weight: 400;
                    }
              
                    h3 {
                      font-size: 1.75em;
                      font-weight: 400;
                    }
                  </style>
                </head>
                <body>${content}</body>
              </html>`,
                  {
                    margin: 15,
                  }
                );

                // It is possible that the name could not end in ncloud
                doc.save(props.name.replace(".ncloud", "") + ".pdf");
              }}
              type="button"
              colour="secondary"
            >
              Extract PDF
            </Button>
            &nbsp;
            <Button
              click={async () => {
                await save();
                window.open(`/api/files/download/${props.save_to}`);
              }}
              type="button"
              colour="secondary"
            >
              Download Not Cloud File
            </Button>
          </Column>
        </Row>
      </Container>
    </>
  );
}
