import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import { GetLocalPath } from "../../../services/files";
import Fs from "fs-extra";
import Path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  Assert(IsObject({ path: IsString }), query);
  const target = GetLocalPath(query.path);
  const { fields, files } = await new Promise<{ fields: Fields; files: Files }>(
    (resolve, reject) => {
      const form = new IncomingForm();
      form.uploadDir = target;
      form.maxFileSize = Number.MAX_SAFE_INTEGER;

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    }
  );

  for (const key in files) {
    const item = files[key];
    const target = Array.isArray(item) ? item : [item];
    for (const file of target) {
      await Fs.rename(
        file.path,
        Path.join(Path.dirname(file.path), file.name)
      );
    }
  }

  res.status(200).send({});
}
