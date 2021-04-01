import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { DeleteBookmark, UpdateBookmark } from "../../../services/bookmark";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  PUT: async (query, body) => {
    Assert(IsObject({ id: IsString }), query);
    Assert(IsObject({ name: IsString, url: IsString }), body);

    await UpdateBookmark(query.id, body.name, body.url);
    return {
      status: 200,
      body: "Updated",
    };
  },
  DELETE: async (query) => {
    Assert(IsObject({ id: IsString }), query);

    await DeleteBookmark(query.id);
    return {
      status: 204,
      body: "Deleted",
    };
  },
});
