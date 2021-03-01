import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import { Delete, GetDirectory } from "../../../../services/files";
import { BuildApi } from "../../../../util/api";

export default BuildApi({
  GET: async (query) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);

    const response = [];
    for await (const item of GetDirectory(query.path.join("/"))) {
      response.push(item);
    }

    return {
      status: 200,
      body: response,
    };
  },
  DELETE: async (query) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    await Delete(query.path.join("/"));
    return { status: 204 };
  },
});
