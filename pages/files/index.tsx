import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Api } from "../../app/api";
import { ExtensionMap } from "../../app/file-icons";
import { Icon } from "../../components/atoms";
import { Navbar } from "../../components/constructs";
import { Column, Container, Row } from "../../components/layout";

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

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
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
        ]}
      ></Navbar>
      <Container>
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
                  <td scope="col" width="250">
                    Created
                  </td>
                </tr>
              </thead>
              <tbody>
                {props.content
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
                            href={`/api/files/download-file?path=${encodeURIComponent(
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
                    </tr>
                  ))}
              </tbody>
            </table>
          </Column>
        </Row>
      </Container>
    </>
  );
}
