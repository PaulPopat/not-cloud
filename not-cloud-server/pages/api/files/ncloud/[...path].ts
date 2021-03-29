import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import { Exists } from "../../../../services/files";
import {
  GetFileString,
  ToHtml,
  WriteFileString,
} from "../../../../services/ncloud";
import { BuildApi } from "../../../../util/api";

export default BuildApi({
  GET: async (query) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    const path = query.path.join("/");
    if (
      path.endsWith(".docx") &&
      !(await Exists(path.replace(".docx", ".ncloud")))
    ) {
      const download = await ToHtml(query.path.join("/"));
      if (!download) {
        return { status: 404 };
      }

      return { status: 200, body: { data: download } };
    }

    const data = await GetFileString(path.replace(".docx", ".ncloud"));
    if (!data) {
      return { status: 404 };
    }

    return { status: 200, body: { data } };
  },
  PUT: async (query, body) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    const path = query.path.join("/");
    if (!path.endsWith(".ncloud")) {
      return { status: 400, body: "Bad file format" };
    }

    Assert(IsObject({ data: IsString }), body);
    await WriteFileString(path, body.data);
    return { status: 200 };
  },
});
