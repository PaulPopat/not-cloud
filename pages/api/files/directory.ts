import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { GetDirectory } from "../../../services/files";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async (query) => {
    Assert(IsObject({ path: IsString }), query);

    const response = [];
    for await (const item of GetDirectory(query.path)) {
      response.push(item);
    }

    return {
      status: 200,
      body: response,
    };
  },
});
