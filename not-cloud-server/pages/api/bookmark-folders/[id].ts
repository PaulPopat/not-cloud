import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { DeleteFolder, UpdateFolder } from "../../../services/bookmark";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  PUT: async (query, body) => {
    Assert(IsObject({ id: IsString }), query);
    Assert(IsObject({ name: IsString }), body);

    await UpdateFolder(query.id, body.name);
    return {
      status: 200,
      body: "Updated",
    };
  },
  DELETE: async (query) => {
    Assert(IsObject({ id: IsString }), query);

    const result = await DeleteFolder(query.id);
    if (result === "Not Empty") {
      return {
        status: 409,
        body: result,
      };
    }

    return {
      status: 204,
      body: "Deleted",
    };
  },
});
