import React from "react";
import { Column, Container, Row } from "../../layout";
import { CreateForm, Field } from "../../constructs/form";
import { Button } from "../../atoms";

const Form = CreateForm({
  name: Field(""),
  url: Field(""),
  username: Field(""),
  password: Field(""),
  description: Field(""),
  tags: [Field("")],
});

export const CreatePassword: React.FC<{
  tags: { id: string; name: string }[];
}> = ({ tags }) => {
  const [tag_count, set_tag_count] = React.useState(1);
  const tags_input = [];
  for (let t = 0; t < tag_count; t += 2) {
    tags_input.push(
      <Row key={t}>
        <Column xs="5">
          <Form.Select
            for={(f) => {
              if (f.tags.length <= t) {
                f.tags.push(Field(""));
              }

              return f.tags[t];
            }}
            autocomplete="off"
            placeholder="Tag"
          >
            {tags.map((t) => (
              <option value={t.id}>{t.name}</option>
            ))}
          </Form.Select>
        </Column>
        {t < tag_count - 1 && (
          <Column xs="5">
            <Form.Select
              for={(f) => {
                if (f.tags.length <= t + 1) {
                  f.tags.push(Field(""));
                }

                return f.tags[t + 1];
              }}
              autocomplete="off"
              placeholder="Tag"
            >
              {tags.map((t) => (
                <option value={t.id}>{t.name}</option>
              ))}
            </Form.Select>
          </Column>
        )}
        {t >= tag_count - 2 && (
          <Column xs="2">
            <Button
              type="button"
              colour="primary"
              click={() => set_tag_count(tag_count + 1)}
            >
              +
            </Button>
          </Column>
        )}
      </Row>
    );
  }

  return (
    <Container>
      <Row>
        <Column>
          <Form submit={(v) => console.log(v)}>
            <Row>
              <Column>
                <Form.Text autocomplete="off" for={(f) => f.name}>
                  Name
                </Form.Text>
              </Column>
              <Column>
                <Form.Text autocomplete="off" for={(f) => f.url}>
                  Url
                </Form.Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Form.Text autocomplete="off" for={(f) => f.username}>
                  Username
                </Form.Text>
              </Column>
              <Column>
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
            {tags_input}
            <Row>
              <Column>
                <Button type="submit" colour="primary">
                  Submit
                </Button>
              </Column>
            </Row>
          </Form>
        </Column>
      </Row>
    </Container>
  );
};
