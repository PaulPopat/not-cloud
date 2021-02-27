import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import {
  DeletePassword,
  GetPassword,
  UpdatePassword,
} from "../../../services/password";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async (query) => {
    Assert(IsObject({ password: IsString }), query);
    try {
      return {
        status: 200,
        body: await GetPassword(query.password),
      };
    } catch (e) {
      console.error(e);
      return { status: 404 };
    }
  },
  PUT: async (query, body) => {
    Assert(IsObject({ password: IsString }), query);
    Assert(
      IsObject({
        name: IsString,
        username: IsString,
        password: IsString,
        description: IsString,
        tags: IsArray(IsString),
      }),
      body
    );

    return {
      status: 200,
      body: await UpdatePassword({ ...body, id: query.password }),
    };
  },
  DELETE: async (query) => {
    Assert(IsObject({ password: IsString }), query);
    await DeletePassword(query.password);
    return { status: 204 };
  },
});
