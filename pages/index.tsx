import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { Column, Container, Row } from "../components/layout";
import React from "react";
import { Api } from "../app/api";
import { H1, H5, Icon, List, P } from "../components/atoms";
import { Modal } from "../components/molecules";
import { CreateForm, Field, Navbar } from "../components/constructs";
import { PasswordEditor } from "../components/constructs/password/editor";
import { EditTag } from "../components/constructs/password/tag";
import { Classes, CopyString } from "../util/html";
import { IsString } from "@paulpopat/safe-type";
import { AlertContext } from "../components/alert-context";

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

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [passwords, set_passwords] = React.useState(props.passwords);
  const [tags, set_tags] = React.useState(props.tags);
  const [editing_password, set_editing_password] = React.useState(false);
  const [current_password, set_current_password] = React.useState("");
  const [editing_tag, set_editing_tag] = React.useState(false);
  const [current_tag, set_current_tag] = React.useState("");
  const [filtering, set_filtering] = React.useState("");
  const [search, set_search] = React.useState(Search.Default);
  const { alert } = React.useContext(AlertContext);
  const term = (search.term.value as string)?.toLowerCase() ?? "";
  return (
    <>
      <Head>
        <title>Passwords | Not Cloud</title>
      </Head>
      <Navbar
        brand="Passwords"
        items={[
          {
            click: () => set_editing_password(true),
            name: "Create a Password",
          },
          { click: () => set_editing_tag(true), name: "Create a Tag" },
        ]}
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
            <H1>Tags</H1>
            <List>
              {filtering && (
                <List.Item>
                  <a
                    href="#"
                    className={Classes("flex-fill")}
                    onClick={(e) => {
                      e.preventDefault();
                      set_filtering("");
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
                .map((t) => (
                  <List.Item key={t.id} active={t.id === filtering} spaced>
                    <a
                      href="#"
                      className={Classes("flex-fill", {
                        "text-white": t.id === filtering,
                      })}
                      onClick={(e) => {
                        e.preventDefault();
                        set_filtering(t.id);
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
                        colour={t.id === filtering ? "light" : "primary"}
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
            <H1>Passwords</H1>
            <List>
              {passwords
                .filter(
                  (p) =>
                    !filtering || p.tags.find((t) => t.id === filtering) != null
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
                  <List.Item key={t.id}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <H5>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            set_editing_password(true);
                            set_current_password(t.id);
                          }}
                        >
                          {t.name}
                        </a>
                      </H5>
                      <div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            const success = CopyString(t.username);
                            success
                              ? alert(
                                  <>
                                    Successfully copied <b>userrname</b> to clipboard.
                                  </>,
                                  "success"
                                )
                              : alert(
                                  <>Failed to copy <b>userrname</b> to clipboard.</>,
                                  "danger"
                                );
                          }}
                        >
                          <Icon
                            is="user"
                            colour="dark"
                            width="30"
                            height="30"
                          />
                        </a>
                        &nbsp;
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            Api.Passwords.Get({ password: t.id }).then((p) => {
                              const success = CopyString(p.password);
                              success
                                ? alert(
                                    <>
                                      Successfully copied <b>password</b> to clipboard.
                                    </>,
                                    "success"
                                  )
                                : alert(
                                    <>Failed to copy <b>password</b> to clipboard.</>,
                                    "danger"
                                  );
                            });
                          }}
                        >
                          <Icon is="key" colour="dark" width="30" height="30" />
                        </a>
                      </div>
                    </div>
                    <p className="mb-1">{t.username}</p>
                  </List.Item>
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
    </>
  );
}
