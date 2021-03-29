import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { DeleteTag, GetTag, UpdateTag } from "../../../services/password";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async (query) => {
    Assert(IsObject({ tag: IsString }), query);
    try {
      return {
        status: 200,
        body: await GetTag(query.tag),
      };
    } catch (e) {
      console.error(e);
      return { status: 404 };
    }
  },
  PUT: async (query, body) => {
    Assert(IsObject({ tag: IsString }), query);
    Assert(IsObject({ name: IsString }), body);

    return {
      status: 200,
      body: await UpdateTag(query.tag, body.name),
    };
  },
  DELETE: async (query) => {
    Assert(IsObject({ tag: IsString }), query);
    await DeleteTag(query.tag);
    return { status: 204 };
  },
});
