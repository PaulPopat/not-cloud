import { Assert, IsObject, IsString, Optional } from "@paulpopat/safe-type";
import { AddBookmark, GetBookmarksBar } from "../../../services/bookmark";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async () => ({
    status: 200,
    body: await GetBookmarksBar(),
  }),
  POST: async (_, body) => {
    Assert(
      IsObject({ name: IsString, url: IsString, folder: Optional(IsString) }),
      body
    );

    await AddBookmark(body.name, body.url, body.folder);
    return {
      status: 201,
      body: "Created",
    };
  },
});
