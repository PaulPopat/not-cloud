import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import { AddPassword, GetAllPasswords } from "../../../services/password";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async () => ({ status: 200, body: await GetAllPasswords() }),
  POST: async (_, body) => {
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
      status: 201,
      body: await AddPassword(body),
    };
  },
});
