import React from "react";
import { Request } from "@paulpopat/molecular-constructs/lib/renderer";
import { Assert, IsString } from "@paulpopat/safe-type";
import { Column, Container, Row } from "../common/layout";
import { Button } from "../common/atoms";
import { UseAsync } from "../common/util";
import { CreateForm, Field } from "../common/form";
import { IsSettings } from "../types";
import { Card } from "../common/molecules";
import { remote } from "electron";

const Form = CreateForm({
  server_address: Field(""),
  local_folders: [Field("")],
  remote_folders: [Field("")],
});

export default (props: { body: unknown; params: unknown }) => {
  const [status, set_status] = React.useState("");
  const [settings] = UseAsync(async () => {
    const response = await Request("/settings", "get", {});
    Assert(IsSettings, response);
    return response;
  });
  const [form, set_form] = React.useState(Form.Default);
  const [syncing, set_syncing] = React.useState(false);

  React.useEffect(() => {
    if (!settings) {
      return;
    }

    set_form({
      server_address: Field(settings.server_address),
      local_folders: settings.folders.map((f) => Field(f.local)),
      remote_folders: settings.folders.map((f) => Field(f.remote)),
    });
  }, [settings]);

  return (
    <Form
      form={form}
      set_form={set_form}
      submit={async (v) => {
        await Request("/settings", "update", {
          server_address: v.server_address,
          folders: v.local_folders.map((f, i) => ({
            local: f,
            remote: v.remote_folders[i],
          })),
        });
      }}
    >
      <Container>
        <Row>
          <Column>
            <div className="bg-light p-3 rounded mb-3 mt-3">
              <div className="bg-white p-2 rounded">
                Status:{" "}
                <code style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                  {status}
                </code>
              </div>
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            <Form.Text for={(f) => f.server_address} autocomplete="off">
              Server Address
            </Form.Text>
          </Column>
        </Row>
        <Row>
          {form.local_folders.map((f, i) => (
            <Column key={i} xs="6">
              <Card>
                <Row>
                  <Column>
                    <Form.Text
                      for={(f) => f.local_folders[i]}
                      autocomplete="off"
                      buttons={[
                        {
                          icon: "file",
                          click: async () => {
                            const result = await remote.dialog.showOpenDialog(
                              remote.getCurrentWindow(),
                              { properties: ["openDirectory"] }
                            );

                            const paths = result.filePaths;
                            if (paths.length !== 1) {
                              return;
                            }

                            set_form({
                              ...form,
                              local_folders: form.local_folders.map((f) => {
                                if (f.id === form.local_folders[i].id) {
                                  return { id: f.id, value: paths[0] };
                                } else {
                                  return f;
                                }
                              }),
                            });
                          },
                        },
                      ]}
                    >
                      Local Path
                    </Form.Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Form.Text
                      for={(f) => f.remote_folders[i]}
                      autocomplete="off"
                    >
                      Remote Path
                    </Form.Text>
                  </Column>
                </Row>
              </Card>
            </Column>
          ))}
        </Row>
        <Row>
          <Column>
            <div className="bg-light p-3 rounded">
              <Button type="submit" colour="primary">
                Save
              </Button>
              &nbsp;
              <Button
                type="button"
                colour="success"
                click={() => {
                  set_form({
                    ...form,
                    local_folders: [...form.local_folders, Field("")],
                    remote_folders: [...form.remote_folders, Field("")],
                  });
                }}
              >
                Add a Target
              </Button>
              &nbsp;
              <Button
                type="button"
                colour="warning"
                click={async () => {
                  set_syncing(true);
                  await Request("/sync", "start", {});
                  let status = await Request("/sync", "status", {});
                  Assert(IsString, status);
                  while (status !== "Finished Sync") {
                    Assert(IsString, status);
                    set_status(status);

                    await new Promise<void>((res) => setTimeout(res, 100));
                    status = await Request("/sync", "status", {});
                  }
                }}
                disabled={syncing}
              >
                Start Sync
              </Button>
            </div>
          </Column>
        </Row>
      </Container>
    </Form>
  );
};
