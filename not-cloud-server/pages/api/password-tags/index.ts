import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { AddTag, GetAllTags } from "../../../services/password";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async () => ({ status: 200, body: await GetAllTags() }),
  POST: async (_, body) => {
    Assert(IsObject({ name: IsString }), body);
    const response = await AddTag(body.name);
    return {
      status: 201,
      body: { id: response.id, name: response.name },
    };
  },
});
