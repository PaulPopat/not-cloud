import { IsArray, IsString } from "@paulpopat/safe-type";
import { GetServerSideProps } from "next";
import { Api } from "../../app/api";
import Page from "./";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context.params?.path;
  if (IsArray(IsString)(path)) {
    return {
      props: {
        content: await Api.Files.ReadDirectory({ path: path.join("/") }),
        base: "",
      },
    };
  }

  return {
    props: {
      content: await Api.Files.ReadDirectory({ path: path ?? "" }),
      base: "",
    },
  };
};

export default Page;
