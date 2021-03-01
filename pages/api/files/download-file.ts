import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { NextApiRequest, NextApiResponse } from "next";
import { PrepareDownload } from "../../../services/files";
import Mime from "mime-types";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  Assert(IsObject({ path: IsString }), query);
  const download = await PrepareDownload(query.path);
  if (!download) {
    res.status(404).send({});
  }

  res.writeHead(200, {
    "Content-Type": Mime.lookup(query.path) as string,
    "Content-Length": download?.stat.size,
  });

  download?.stream.pipe(res);
}
