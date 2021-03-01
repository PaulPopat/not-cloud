import React from "react";
import { v4 as Guid } from "uuid";
import { AppProps } from "next/app";
import "../styles/index.scss";
import { AlertContext } from "../components/alert-context";
import { ThemeColour } from "../components/types";
import { Alert } from "../components/atoms";
import { Column, Container, Row } from "../components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const [alerts, set_alerts] = React.useState<
    { id: string; html: JSX.Element; type: ThemeColour }[]
  >([]);
  return (
    <AlertContext.Provider
      value={{
        alert: (html, type) => {
          const id = Guid();
          set_alerts([...alerts, { id, html, type }]);
          setTimeout(() => {
            set_alerts((a) => a.filter((i) => i.id !== id));
          }, 5000);
        },
      }}
    >
      {alerts.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: "0",
            width: "100%",
            zIndex: 1,
          }}
        >
          <Container>
            {alerts.map((a) => (
              <Row>
                <Column xs="12">
                  <Alert key={a.id} colour={a.type}>
                    {a.html}
                  </Alert>
                </Column>
              </Row>
            ))}
          </Container>
        </div>
      )}
      <Component {...pageProps} />
    </AlertContext.Provider>
  );
}
