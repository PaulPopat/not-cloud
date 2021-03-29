import React from "react";
import { v4 as Guid } from "uuid";
import { AppProps } from "next/app";
import "../style/index.scss";
import Router from "next/router";
import { AlertContext } from "../components/alert-context";
import { ThemeColour } from "../common/component-types";
import { Alert, Icon, Transition } from "../common/atoms";
import { Column, Container, Row } from "../common/layout";
import { LinkContext } from "../common/link";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  const [alerts, set_alerts] = React.useState<
    { id: string; html: JSX.Element; type: ThemeColour }[]
  >([]);
  const [loading, set_loading] = React.useState(false);

  Router.events.on("routeChangeStart", () => set_loading(true));
  Router.events.on("routeChangeComplete", () => set_loading(false));
  Router.events.on("routeChangeError", () => set_loading(false));

  return (
    <LinkContext.Provider
      value={(props) => (
        <Link href={props.href}>
          <a {...{ ...props, href: undefined }}>{props.children}</a>
        </Link>
      )}
    >
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
        <Component {...pageProps} />
        {alerts.length > 0 && (
          <div
            style={{
              position: "fixed",
              top: "72px",
              left: "0",
              width: "100%",
              zIndex: 1,
            }}
          >
            <Container>
              {alerts.map((a) => (
                <Row key={a.id}>
                  <Column xs="12">
                    <Alert colour={a.type}>{a.html}</Alert>
                  </Column>
                </Row>
              ))}
            </Container>
          </div>
        )}
        <Transition
          show={loading}
          hidden={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 99999,
            opacity: 0,
            transition: "opacity 500ms",
          }}
          shown={{ opacity: 1 }}
          time={500}
        >
          <div
            className="bg-white"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon is="loading" colour="dark" width="300" height="300" />
          </div>
        </Transition>
      </AlertContext.Provider>
    </LinkContext.Provider>
  );
}
