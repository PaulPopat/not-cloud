import { BuildApi } from "../../util/api";
import Fs from "fs-extra";

export default BuildApi({
  GET: async () => ({
    status: 200,
    body: await Fs.readFile(
      "./node_modules/@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor.js",
      "utf-8"
    ),
    headers: {
      "Content-Type": "text/javascript",
    },
  }),
});
