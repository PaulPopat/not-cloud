import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { GetDomain, RegisterDomain } from "../../services/site-settings";
import { BuildApi } from "../../util/api";

export default BuildApi({
  GET: async () => ({
    status: 200,
    body: {
      domain: await GetDomain(),
    },
  }),
  PUT: async (_, body) => {
    Assert(IsObject({ domain: IsString }), body);
    await RegisterDomain(body.domain);

    return {
      status: 200,
      body: {
        domain: await GetDomain(),
      },
    };
  },
});
