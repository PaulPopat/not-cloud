import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { CreateDirectory, GetDirectory } from "../../../../services/files";
import { BuildApi } from "../../../../util/api";

export default BuildApi({
  GET: async () => {
    const response = [];
    for await (const item of GetDirectory("")) {
      response.push(item);
    }

    return {
      status: 200,
      body: response,
    };
  },
  POST: async (query, body) => {
    Assert(IsObject({ add: IsString }), body);
    await CreateDirectory("", body.add);
    return { status: 200 };
  },
});
