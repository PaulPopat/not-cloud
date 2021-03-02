import { GetSpace } from "../../../services/files";
import { BuildApi } from "../../../util/api";

export default BuildApi({
  GET: async () => ({ status: 200, body: await GetSpace() }),
});
