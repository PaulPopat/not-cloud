import React from "react";
import { Column, Container, Row } from "../../layout";
import { CreateForm, Field } from "../form";
import { Button } from "../../atoms";
import { Api } from "../../../app/api";
import { Assert, IsObject, IsString } from "@paulpopat/safe-type";

const Form = CreateForm({
  name: Field(""),
});

type Props = {
  updated: (tag: { id: string; name: string }) => void;
  deleted: () => void;
  tag?: string;
};

export const EditTag: React.FC<Props> = ({ updated, tag, deleted }) => {
  const [value, set_value] = React.useState(Form.Default);
  const [confirming, set_confirming] = React.useState(false);
  React.useEffect(() => {
    if (tag) {
      Api.Passwords.Tags.Get({ tag }).then((p) => {
        set_value({
          name: Field(p.name),
        });
      });
    } else {
      set_value(Form.Default);
    }
  }, [tag]);
  return (
    <Container>
      <Row>
        <Column>
          <Form
            submit={async (v) => {
              Assert(IsObject({ name: IsString }), v);
              if (tag) {
                updated(await Api.Passwords.Tags.Put({ tag }, v));
              } else {
                updated(await Api.Passwords.Tags.Post(v));
              }
            }}
            form={value}
            set_form={set_value}
          >
            <Row>
              <Column>
                <Form.Text autocomplete="off" for={(f) => f.name}>
                  Name
                </Form.Text>
              </Column>
            </Row>
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
                  <Button
                    type="button"
                    colour="danger"
                    click={async () => {
                      if (!confirming) {
                        set_confirming(true);
                        return;
                      }

                      Assert(IsString, tag);
                      await Api.Passwords.Tags.Delete({ tag });
                      set_confirming(false);
                      deleted();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Column>
            </Row>
          </Form>
        </Column>
      </Row>
    </Container>
  );
};
