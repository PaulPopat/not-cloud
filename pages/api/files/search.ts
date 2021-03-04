import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { Search } from "../../../services/files";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async (query) => {
    Assert(IsObject({ term: IsString }), query);
    return { status: 200, body: await Search(query.term) };
  },
});
