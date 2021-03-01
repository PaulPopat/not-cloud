import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Api } from "../../app/api";
import { ExtensionMap } from "../../app/file-icons";
import { Button, H2, Icon, P } from "../../components/atoms";
import { Navbar } from "../../components/constructs";
import { CreateForm, Field, FileDrop } from "../../components/constructs/form";
import { Column, Container, Row } from "../../components/layout";
import { Modal } from "../../components/molecules";

function FormatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const getServerSideProps = async () => {
  return {
    props: {
      content: await Api.Files.ReadDirectory({ path: "" }),
      base: "",
    },
  };
};

const Form = CreateForm({ name: Field("") });

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [content, set_content] = React.useState(props.content);
  const [deleting, set_deleting] = React.useState("");
  React.useEffect(() => {
    set_content(props.content);
  }, [props.content]);
  const [creating, set_creating] = React.useState(false);
  const [editing, set_editing] = React.useState("");
  const [form, set_form] = React.useState(Form.Default);

  React.useEffect(() => {
    set_form({ ...form, name: { ...form.name, value: editing } });
  }, [editing]);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Not Cloud | Files</title>
      </Head>
      <Navbar
        brand="Not Cloud"
        items={[
          {
            click: "/",
            name: "Home",
          },
          {
            click: "/passwords",
            name: "Passwords",
          },
          {
            click: () => set_creating(true),
            name: "New Folder",
          },
        ]}
      ></Navbar>
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
          <Column>
            <table className="table">
              <thead>
                <tr>
                  <td scope="col" width="50"></td>
                  <td scope="col">Name</td>
                  <td scope="col" width="150">
                    Size
                  </td>
                  <td scope="col" width="200">
                    Created
                  </td>
                  <td scope="col" width="75"></td>
                </tr>
              </thead>
              <tbody>
                {content
                  .sort((a, b) => {
                    if (a.type !== b.type) {
                      return a.type === "directory" ? -1 : 1;
                    }

                    const pa = a.name.toLowerCase();
                    const pb = b.name.toLowerCase();
                    return pa < pb ? -1 : pa > pb ? 1 : 0;
                  })
                  .map((c) => (
                    <tr key={c.name}>
                      <td>
                        <Icon
                          is={
                            c.type === "directory"
                              ? "folder"
                              : ExtensionMap[c.extension] ?? "file"
                          }
                          colour="dark"
                          width="20"
                          height="20"
                          valign="sub"
                        />
                      </td>
                      <td>
                        {c.type === "directory" ? (
                          <Link href={router.asPath + "/" + c.name}>
                            <a>{c.name + c.extension}</a>
                          </Link>
                        ) : (
                          <a
                            href={`/api/files/download?path=${encodeURIComponent(
                              c.download_url
                            )}`}
                            target="_blank"
                          >
                            {c.name + c.extension}
                          </a>
                        )}
                      </td>
                      <td>
                        {c.type === "directory" ? "N/A" : FormatBytes(c.size)}
                      </td>
                      <td>{new Date(c.edited).toLocaleString()}</td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            set_editing(c.name + c.extension);
                          }}
                        >
                          <Icon
                            is="edit"
                            colour="dark"
                            width="20"
                            height="20"
                            valign="sub"
                          />
                        </a>
                        &nbsp;
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            set_deleting(c.download_url);
                          }}
                        >
                          <Icon
                            is="trash"
                            colour="dark"
                            width="20"
                            height="20"
                            valign="sub"
                          />
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Column>
        </Row>
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
            if (editing) {
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
            set_form(Form.Default);
          }
        }}
      >
        <Modal
          show={editing != "" || creating}
          close={() => {
            set_editing("");
            set_creating(false);
            set_form(Form.Default);
          }}
          title={editing ? <>Rename</> : <>Create Folder</>}
          footer={
            <Button type="submit" colour="primary">
              Submit
            </Button>
          }
        >
          <Form.Text for={(f) => f.name} autocomplete="off" />
        </Modal>
      </Form>
    </>
  );
}
