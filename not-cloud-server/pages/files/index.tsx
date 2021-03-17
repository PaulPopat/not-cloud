import { IsString } from "@paulpopat/safe-type";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Api } from "../../app/api";
import { ExtensionMap } from "../../app/file-extensions";
import { BuildNav } from "../../app/nav";
import { Button, H2, P } from "../../common/atoms";
import { Navbar } from "../../components/navbar";
import { CardView } from "../../components/files/card-view";
import { TableView } from "../../components/files/table-view";
import { CreateForm, Field, FileDrop } from "../../common/form";
import { Column, Container, Row } from "../../common/layout";
import { Breadcrumbs, Modal, ProgressBar } from "../../common/molecules";
import { FormatBytes } from "../../common/util";
import Mime from "mime-types";

export const getServerSideProps = async () => {
  return {
    props: {
      content: await Api.Files.ReadDirectory({ path: "" }),
      base: "",
      space: await Api.Files.FreeSpace(),
    },
  };
};

const Form = CreateForm({ name: Field("") });

const Search = CreateForm({
  term: Field(""),
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const [content, set_content] = React.useState(props.content);
  const [deleting, set_deleting] = React.useState("");
  const [creating, set_creating] = React.useState(false);
  const [editing, set_editing] = React.useState("");
  const [new_ncloud, set_new_ncloud] = React.useState(false);
  const [form, set_form] = React.useState(Form.Default);
  const [mode, set_mode] = React.useState<"table" | "card">("card");
  const [search, set_search] = React.useState(Search.Default);

  React.useEffect(() => {
    set_content(props.content);
  }, [props.content]);

  React.useEffect(() => {
    set_form({ ...form, name: { ...form.name, value: editing } });
  }, [editing]);

  return (
    <>
      <Head>
        <title>Files | Not Cloud</title>
      </Head>
      <Navbar
        items={BuildNav([
          {
            click: () => set_creating(true),
            name: "New Folder",
          },
          {
            click: () => set_new_ncloud(true),
            name: "Create New Document",
          },
          {
            click: () => set_mode("table"),
            name: "Table View",
            disabled: mode === "table",
          },
          {
            click: () => set_mode("card"),
            name: "Card View",
            disabled: mode === "card",
          },
        ])}
      >
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
        <Row>
          <Column>
            <FileDrop
              file={(f) => {
                const body = new FormData();
                body.append("file", f);

                fetch(
                  `/api/files/upload?path=${encodeURIComponent(
                    props.base + "/" + f.name
                  )}`,
                  { method: "POST", body }
                ).then(() => {
                  Api.Files.ReadDirectory({ path: props.base }).then(
                    set_content
                  );
                });
              }}
            >
              <div className="file-uploader">
                <H2>File Upload</H2>
                <P>
                  Drag and drop a file or multiple files here to upload them.
                </P>
              </div>
            </FileDrop>
          </Column>
        </Row>
        <Row>
          <Column xs="12" lg="6">
            <Breadcrumbs>
              <Breadcrumbs.Item href={"/files"}>Home</Breadcrumbs.Item>
              {props.base.split("/").map((b, i, items) =>
                i === items.length - 1 ? (
                  <Breadcrumbs.This key={b}>{b}</Breadcrumbs.This>
                ) : (
                  <Breadcrumbs.Item
                    key={b}
                    href={"/files/" + items.slice(0, i + 1).join("/")}
                  >
                    {b}
                  </Breadcrumbs.Item>
                )
              )}
            </Breadcrumbs>
          </Column>
          <Column xs="12" lg="3">
            <P align="end">
              Using {FormatBytes(props.space.used)} of{" "}
              {FormatBytes(props.space.total)}
            </P>
          </Column>
          <Column xs="12" lg="3">
            <ProgressBar
              colour="success"
              value={props.space.used}
              max={props.space.total}
            />
          </Column>
        </Row>
        {mode === "table" && (
          <TableView
            content={content}
            set_deleting={set_deleting}
            set_editing={set_editing}
          />
        )}
        {mode === "card" && (
          <CardView
            content={content}
            set_deleting={set_deleting}
            set_editing={set_editing}
          />
        )}
      </Container>
      <Modal
        show={deleting != ""}
        close={() => set_deleting("")}
        title={<>Are you sure?</>}
        footer={
          <Button
            type="button"
            colour="danger"
            click={async () => {
              try {
                await Api.Files.Delete({ path: deleting });
              } finally {
                set_content(
                  await Api.Files.ReadDirectory({ path: props.base })
                );
                set_deleting("");
              }
            }}
          >
            Confirm Delete
          </Button>
        }
      >
        <P>This is not reversible.</P>
      </Modal>
      <Form
        form={form}
        set_form={set_form}
        submit={async (f) => {
          try {
            if (new_ncloud) {
              const path = props.base + "/" + f.name + ".ncloud";
              await Api.Files.NCloudFile.Write(
                { path: path },
                { data: "<p></p>" }
              );
              router.push(`/documents/${encodeURI(path)}`);
            } else if (editing) {
              await Api.Files.Rename(
                { path: props.base + "/" + editing },
                { to: f.name as string }
              );
            } else {
              await Api.Files.MakeDirectory(
                { path: props.base },
                { add: f.name as string }
              );
            }
          } finally {
            set_content(await Api.Files.ReadDirectory({ path: props.base }));
            set_editing("");
            set_creating(false);
            set_new_ncloud(false);
            set_form(Form.Default);
          }
        }}
      >
        <Modal
          show={editing != "" || creating || new_ncloud}
          close={() => {
            set_editing("");
            set_creating(false);
            set_form(Form.Default);
            set_new_ncloud(false);
          }}
          title={
            new_ncloud ? (
              <>New Document</>
            ) : editing ? (
              <>Rename</>
            ) : (
              <>Create Folder</>
            )
          }
          footer={
            <Button type="submit" colour="primary">
              Submit
            </Button>
          }
        >
          <Form.Text for={(f) => f.name} autocomplete="off">
            Name
          </Form.Text>
        </Modal>
        <Modal
          show={IsString(router.query.view)}
          close={() => router.push(router.asPath.split("?")[0])}
          title={<>{router.query.view}</>}
          size="xl"
          footer={
            <>
              {IsString(router.query.view) && (
                <Button.External
                  colour="success"
                  href={`/api/files/download/${encodeURI(
                    props.base
                  )}/${encodeURI(router.query.view)}`}
                  no-margin
                >
                  Download
                </Button.External>
              )}
            </>
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "-1rem",
            }}
          >
            {IsString(router.query.view) &&
              (ExtensionMap(router.query.view) === "image" ? (
                <img
                  src={`/api/files/download/${encodeURI(
                    props.base
                  )}/${encodeURI(router.query.view)}`}
                />
              ) : (
                <video width="100%" controls>
                  <source
                    src={`/api/files/download/${encodeURI(
                      props.base
                    )}/${encodeURI(router.query.view)}`}
                    type={Mime.lookup(router.query.view) || undefined}
                  />
                </video>
              ))}
          </div>
        </Modal>
      </Form>
    </>
  );
}
