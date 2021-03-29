import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import {
  CreateDirectory,
  Delete,
  GetDirectory,
  Rename,
} from "../../../../services/files";
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
  PUT: async (query, body) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    Assert(IsObject({ to: IsString }), body);
    await Rename(query.path.join("/"), body.to);
    return { status: 200 };
  },
  POST: async (query, body) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    Assert(IsObject({ add: IsString }), body);
    await CreateDirectory(query.path.join("/"), body.add);
    return { status: 200 };
  },
});
