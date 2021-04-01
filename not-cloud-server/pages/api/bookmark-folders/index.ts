import { Assert, IsObject, IsString, Optional } from "@paulpopat/safe-type";
import { AddFolder } from "../../../services/bookmark";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  POST: async (_, body) => {
    Assert(
      IsObject({ name: IsString, parent: Optional(IsString) }),
      body
    );

    await AddFolder(body.name, body.parent);
    return {
      status: 201,
      body: "Created",
    };
  },
});
