import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import { Download } from "../../../services/files";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  Assert(IsObject({ path: IsString }), query);
  const { fields, files } = await new Promise<{ fields: Fields; files: Files }>(
    (resolve, reject) => {
      const form = new IncomingForm();
      form.maxFileSize = Number.MAX_SAFE_INTEGER;

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    }
  );

  if (Object.keys(files).length > 1) {
    throw new Error("Attempted to upload multiple files");
  }

  for (const key in files) {
    await Download(query.path, files[key]);
  }

  res.status(200).send({});
}
