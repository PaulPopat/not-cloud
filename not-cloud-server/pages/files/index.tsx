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
import { FileActionsContext } from "../../components/files/file-actions";

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
  const [sharing_link, set_sharing_link] = React.useState("");
  const [uploading, set_uploading] = React.useState(false);

  const share = (path: string) =>
    Api.Files.Share({ path }, {}).then((r) => {
      set_sharing_link(r);
      Api.Files.ReadDirectory({ path: props.base }).then(set_content);
    });

  const un_share = (path: string) =>
    Api.Files.UnShare({ path }).then(() =>
      Api.Files.ReadDirectory({ path: props.base }).then(set_content)
    );

  React.useEffect(() => {
    set_content(props.content);
  }, [props.content]);

  React.useEffect(() => {
    set_form({ ...form, name: { ...form.name, value: editing } });
  }, [editing]);

  return (
    <FileActionsContext.Provider
      value={{ set_deleting, set_editing, share, un_share }}
    >
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
            click: () => set_uploading(true),
            name: "Upload a file",
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
        {mode === "table" && <TableView content={content} />}
        {mode === "card" && <CardView content={content} />}
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
        <P>Are you sure you want to delete;</P>
        <P>
          <i>{deleting}</i>
        </P>
        <P>This is not reversible.</P>
      </Modal>
      <Modal
        show={sharing_link != ""}
        close={() => set_sharing_link("")}
        title={<>One time sharing link created!</>}
      >
        <P>
          Below is your one time sharing link. Please copy that to the person
          that you want to be able to access the file.
        </P>
        <div className="input-group mb-3">
          <input
            className="form-control"
            readOnly
            aria-readonly
            value={sharing_link}
          />
        </div>
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
        <Modal
          show={uploading}
          close={() => set_uploading(false)}
          title={<>Upload</>}
        >
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
                    Api.Files.ReadDirectory({ path: props.base }).then((r) => {
                      set_content(r);
                      set_uploading(false);
                    });
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
        </Modal>
      </Form>
    </FileActionsContext.Provider>
  );
}
