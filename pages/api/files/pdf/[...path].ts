import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import { NextApiRequest, NextApiResponse } from "next";
import Puppeteer from "puppeteer";
import Mime from "mime-types";
import { GetFileString } from "../../../../services/files";
import { Readable } from "stream";

async function PrintPDF(html: string) {
  const browser = await Puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const input = `<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font: 16px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      p {
        font-size: 1em;
        line-height: 1.63em;
        padding-top: 0.5em;
        margin-bottom: 1.13em;
      }

      h1, h2, h3, h4, h5, h6, h7, h8 {
        font-weight: 400;
      }
    </style>
  </head>
  <body>${html}</body>
</html>`;
  await page.setContent(input, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "a4",
    margin: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  await browser.close();
  return pdf;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  Assert(IsObject({ path: IsArray(IsString) }), query);
  const location = query.path.join("/");
  const download = await PrintPDF(
    (await GetFileString(location.replace(".pdf", ".ncloud"))) ?? ""
  );
  if (!download) {
    res.status(404).send({});
  }

  res.writeHead(200, {
    "Content-Type": Mime.lookup(".pdf") as string,
    "Content-Length": download.byteLength,
  });

  const stream = new Readable();
  stream._read = () => {};
  stream.push(download);
  stream.push(null);

  stream.pipe(res);
}
