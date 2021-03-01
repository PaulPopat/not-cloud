import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon/favicon.ico" />
          <link rel="icon" href="/favicon/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
