import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { Column, Container, Row } from "../common/layout";
import React from "react";
import { Api } from "../app/api";
import { Button, H5, Icon, List, P, H3 } from "../common/atoms";
import { Modal } from "../common/molecules";
import { CreateForm, Field, FileDrop } from "../common/form";
import { PasswordEditor } from "../components/password/editor";
import { EditTag } from "../components/password/tag";
import { Classes, CopyString, Unpromise } from "../common/util";
import { AlertContext } from "../components/alert-context";
import { IconName } from "../common/atoms";
import { BuildNav } from "../app/nav";
import { Navbar } from "../components/navbar";

export const getServerSideProps = async () => {
  return {
    props: {
      passwords: await Api.Passwords.GetAll(),
      tags: await Api.Passwords.Tags.GetAll(),
    },
  };
};

const Search = CreateForm({
  term: Field(""),
});

const CopyButton: React.FC<{ icon: IconName; text: string; field: string }> = ({
  icon,
  text,
  field,
}) => {
  const { alert } = React.useContext(AlertContext);
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        CopyString(text).then((success) =>
          success === "success"
            ? alert(
                <>
                  Successfully copied <b>{field}</b> to clipboard.
                </>,
                "success"
              )
            : alert(
                <>
                  Failed to copy <b>{field}</b> to clipboard.
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {success.toString()}
                  </div>
                </>,
                "danger"
              )
        );
      }}
    >
      <Icon is={icon} colour="dark" width="30" height="30" />
    </a>
  );
};

const PasswordItem: React.FC<{
  id: string;
  name: string;
  username: string;
  on_open: () => void;
}> = ({ on_open, name, username, id }) => {
  const [password, set_password] = React.useState<
    Unpromise<ReturnType<typeof Api["Passwords"]["Get"]>>
  >();
  return (
    <List.Button
      click={() => {
        if (password) {
          set_password(undefined);
        } else {
          Api.Passwords.Get({ password: id }).then(set_password);
        }
      }}
      action
    >
      <div
        className="text-dark"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <H5>{name}</H5>
        {password && (
          <div>
            <CopyButton icon="user" text={username} field="username" />
            &nbsp;
            <CopyButton icon="key" text={password.password} field="password" />
            &nbsp;
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                on_open();
              }}
            >
              <Icon is="edit" colour="dark" width="30" height="30" />
            </a>
          </div>
        )}
      </div>
      <p className="mb-1 text-dark">{username}</p>
    </List.Button>
  );
};

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { alert } = React.useContext(AlertContext);
  const [passwords, set_passwords] = React.useState(props.passwords);
  const [tags, set_tags] = React.useState(props.tags);
  const [editing_password, set_editing_password] = React.useState(false);
  const [current_password, set_current_password] = React.useState("");
  const [editing_tag, set_editing_tag] = React.useState(false);
  const [current_tag, set_current_tag] = React.useState("");
  const [filtering, set_filtering] = React.useState([] as string[]);
  const [search, set_search] = React.useState(Search.Default);
  const [bulk, set_bulk] = React.useState(false);
  const term = (search.term.value as string)?.toLowerCase() ?? "";
  return (
    <>
      <Head>
        <title>Passwords | Not Cloud</title>
      </Head>
      <Navbar
        items={BuildNav([
          {
            click: () => set_editing_password(true),
            name: "Create a Password",
          },
          { click: () => set_editing_tag(true), name: "Create a Tag" },
          {
            click: () => set_bulk(true),
            name: "Bulk Edit",
          },
        ])}
      >
        <Search form={search} set_form={set_search} submit={() => {}}>
          <Search.InlineText
            for={(s) => s.term}
            autocomplete="off"
            placeholder="Search"
          />
        </Search>
      </Navbar>
      <Container>
        <Row>
          <Column xs="12" md="3">
            <List>
              {filtering.length > 0 && (
                <List.Item>
                  <a
                    href="#"
                    className={Classes("flex-fill")}
                    onClick={(e) => {
                      e.preventDefault();
                      set_filtering([]);
                    }}
                  >
                    Clear
                  </a>
                </List.Item>
              )}
              {tags
                .sort((a, b) => {
                  const pa = a.name.toLowerCase();
                  const pb = b.name.toLowerCase();
                  return pa < pb ? -1 : pa > pb ? 1 : 0;
                })
                .map((t) => ({
                  ...t,
                  filtering: filtering.find((f) => f === t.id) != null,
                }))
                .map((t) => (
                  <List.Item key={t.id} active={t.filtering} spaced>
                    <a
                      href="#"
                      className={Classes("flex-fill", {
                        "text-white": t.filtering,
                      })}
                      onClick={(e) => {
                        e.preventDefault();
                        set_filtering(
                          t.filtering
                            ? filtering.filter((f) => f !== t.id)
                            : [...filtering, t.id]
                        );
                      }}
                    >
                      {t.name}
                    </a>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        set_editing_tag(true);
                        set_current_tag(t.id);
                      }}
                    >
                      <Icon
                        is="edit"
                        colour={t.filtering ? "light" : "primary"}
                        width="20"
                        height="20"
                        valign="sub"
                      />
                    </a>
                  </List.Item>
                ))}
            </List>
          </Column>
          <Column xs="12" md="9">
            <List>
              {passwords
                .filter(
                  (p) =>
                    filtering.length === 0 ||
                    filtering.filter((f) => p.tags.find((t) => t.id === f))
                      .length === filtering.length
                )
                .filter((p) => {
                  if (!term) {
                    return true;
                  }

                  return (
                    p.name.toLowerCase().includes(term) ||
                    p.url.toLowerCase().includes(term) ||
                    p.username.toLowerCase().includes(term)
                  );
                })
                .sort((a, b) => {
                  const pa = a.name.toLowerCase();
                  const pb = b.name.toLowerCase();
                  return pa < pb ? -1 : pa > pb ? 1 : 0;
                })
                .map((t) => (
                  <PasswordItem
                    key={t.id}
                    id={t.id}
                    name={t.name}
                    username={t.username}
                    on_open={() => {
                      set_editing_password(true);
                      set_current_password(t.id);
                    }}
                  />
                ))}
            </List>
          </Column>
        </Row>
      </Container>
      <Modal
        show={editing_password}
        close={() => {
          set_current_password("");
          set_editing_password(false);
        }}
        title={<>Create a Password</>}
        size="lg"
        scrollable
      >
        <PasswordEditor
          tags={tags}
          updated={(password) => {
            set_passwords([
              ...passwords.filter((p) => p.id !== password.id),
              password,
            ]);
            set_current_password("");
            set_editing_password(false);
          }}
          deleted={() => {
            set_passwords(passwords.filter((p) => p.id !== current_password));
            set_editing_password(false);
            set_current_password("");
          }}
          password={current_password}
        />
      </Modal>
      <Modal
        show={editing_tag}
        close={() => {
          set_editing_tag(false);
          set_current_tag("");
        }}
        title={<>Create a Tag</>}
        scrollable
      >
        <EditTag
          updated={(tag) => {
            set_tags([...tags.filter((p) => p.id !== tag.id), tag]);
            set_editing_tag(false);
            set_current_tag("");
          }}
          deleted={() => {
            set_tags(tags.filter((p) => p.id !== current_tag));
            set_editing_tag(false);
            set_current_tag("");
          }}
          tag={current_tag}
        />
      </Modal>
      <Modal
        show={bulk}
        close={() => set_bulk(false)}
        title={<>Bulk Edit</>}
        footer={
          <Button
            type="button"
            colour="danger"
            click={async () => {
              const element = document.createElement("a");
              element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," +
                  encodeURIComponent(
                    JSON.stringify(await Api.Passwords.BulkExport())
                  )
              );
              element.setAttribute("download", "not-cloud-passwords.json");

              element.style.display = "none";
              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
            }}
          >
            Bulk Download
          </Button>
        }
      >
        <P>
          <b>WARNING!</b> Downloading bulk passwords will download{" "}
          <b>UNENCRYPTED</b> passwords onto your machine. Make sure you delete
          these securely when you are done.
        </P>
        <P>
          This is irrelivant if you have the same security credentials on this
          machine as you do on your server. So, to reiterate, make sure your
          server is well encrypted and behind a proper firewall. This software
          does not handle security for you!
        </P>
        <FileDrop
          file={(file) => {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (evt) => {
              const json = JSON.parse(evt.target?.result as string);
              Api.Passwords.BulkImport(json)
                .then(async () => {
                  set_passwords(await Api.Passwords.GetAll());
                  set_bulk(false);
                  alert(<>Successfully imported the passwords.</>, "success");
                })
                .catch(() => {
                  set_bulk(false);
                  alert(
                    <>
                      Failed to upload the bulk file. Post an issue on GitHub if
                      this continues.
                    </>,
                    "danger"
                  );
                });
            };
            reader.onerror = (evt) => {
              set_bulk(false);
              alert(
                <>
                  Failed to read the bulk file. Post an issue on GitHub if this
                  continues.
                </>,
                "danger"
              );
            };
          }}
        >
          <div className="file-uploader">
            <H3>Drag and drop your bulk files here</H3>
            <P>This will import them into your current cloud.</P>
          </div>
        </FileDrop>
      </Modal>
    </>
  );
}
