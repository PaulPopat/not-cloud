import React from "react";
import { Column, Container, Row } from "../../common/layout";
import { CreateForm, Field } from "../../common/form";
import { Button, Icon } from "../../common/atoms";
import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import { Api } from "../../app/api";

const Form = CreateForm({
  name: Field(""),
  url: Field(""),
  username: Field(""),
  password: Field(""),
  description: Field(""),
  tags: [Field("")],
});

export const PasswordEditor: React.FC<{
  tags: { id: string; name: string }[];
  updated: (value: {
    id: string;
    name: string;
    url: string;
    username: string;
    tags: {
      id: string;
      name: string;
    }[];
  }) => void;
  deleted: () => void;
  password?: string;
}> = ({ tags, updated, password, deleted }) => {
  const [value, set_value] = React.useState(Form.Default);
  const [confirming, set_confirming] = React.useState(false);
  React.useEffect(() => {
    if (password) {
      Api.Passwords.Get({ password }).then((p) => {
        set_value({
          name: Field(p.name),
          url: Field(p.url),
          username: Field(p.username),
          password: Field(p.password),
          description: Field(p.description),
          tags:
            p.tags.length > 0 ? p.tags.map((t) => Field(t.id)) : [Field("")],
        });
      });
    } else {
      set_value(Form.Default);
    }
  }, [password]);
  return (
    <Container>
      <Row>
        <Column>
          <Form
            submit={async (v) => {
              Assert(
                IsObject({
                  name: IsString,
                  url: IsString,
                  username: IsString,
                  password: IsString,
                  description: IsString,
                  tags: IsArray(IsString),
                }),
                v
              );

              if (password) {
                updated(await Api.Passwords.Put({ password }, v));
              } else {
                updated(await Api.Passwords.Post(v));
              }

              set_value(Form.Default);
            }}
            form={value}
            set_form={set_value}
          >
            <Row>
              <Column xs="12" md="6">
                <Form.Text autocomplete="off" for={(f) => f.name}>
                  Name
                </Form.Text>
              </Column>
              <Column xs="12" md="6">
                <Form.Text autocomplete="off" for={(f) => f.url}>
                  Url
                </Form.Text>
              </Column>
            </Row>
            <Row>
              <Column xs="12" md="6">
                <Form.Text autocomplete="off" for={(f) => f.username}>
                  Username
                </Form.Text>
              </Column>
              <Column xs="12" md="6">
                <Form.Password autocomplete="off" for={(f) => f.password}>
                  Password
                </Form.Password>
              </Column>
            </Row>
            <Row>
              <Column>
                <Form.TextArea autocomplete="off" for={(f) => f.description}>
                  Description
                </Form.TextArea>
              </Column>
            </Row>
            {value.tags.map((t, i) => (
              <Row key={t.id}>
                <Column xs="12">
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }} className="me-3">
                      <Form.Select
                        for={(f) => t}
                        autocomplete="off"
                        placeholder="No Tag Selected"
                      >
                        {tags.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="mb-3">
                      {i !== value.tags.length - 1 ? (
                        <Button
                          type="button"
                          colour="secondary"
                          click={() =>
                            set_value({
                              ...value,
                              tags: value.tags.filter((f) => f.id !== t.id),
                            })
                          }
                        >
                          <Icon
                            is="minus-circle"
                            width="20"
                            height="20"
                            colour="light"
                            valign="sub"
                          />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          colour="primary"
                          click={() =>
                            set_value({
                              ...value,
                              tags: [...value.tags, Field("")],
                            })
                          }
                        >
                          <Icon
                            is="plus-circle"
                            width="20"
                            height="20"
                            colour="light"
                            valign="sub"
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </Column>
              </Row>
            ))}
            <Row>
              <Column>
                <div className="d-grid gap-2">
                  <Button type="submit" colour="primary">
                    Submit
                  </Button>
                  {confirming && (
                    <div className="text-center mb-1">
                      Click delete again to confirm.
                    </div>
                  )}
                  {password && (
                    <Button
                      type="button"
                      colour="danger"
                      click={async () => {
                        if (!confirming) {
                          set_confirming(true);
                          return;
                        }

                        Assert(IsString, password);
                        await Api.Passwords.Delete({ password });
                        set_confirming(false);
                        deleted();
                        set_value(Form.Default);
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Column>
            </Row>
          </Form>
        </Column>
      </Row>
    </Container>
  );
};
