import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import { GetLocalPath } from "../../../../services/files";
import { Access, ShareFile } from "../../../../services/shared-files";
import { GetDomain } from "../../../../services/site-settings";
import { BuildApi } from "../../../../util/api";
import { BuildUrlWithDomain } from "../../../../util/url";

export default BuildApi({
  POST: async (query) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    const location = query.path.join("/");
    ShareFile(GetLocalPath(location));
    const domain = await GetDomain();
    return { status: 201, body: BuildUrlWithDomain(domain, location) };
  },
  DELETE: async (query) => {
    Assert(IsObject({ path: IsArray(IsString) }), query);
    const location = query.path.join("/");
    Access(GetLocalPath(location));
    return { status: 204 };
  },
});
