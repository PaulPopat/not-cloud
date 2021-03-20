import Express from "express";
import { Access } from "../services/shared-files";
import { GetLocalPath } from "../services/files";

export async function StartFileShareServer() {
  const app = Express();
  app.get("*", async (req, res) => {
    const url = GetLocalPath(decodeURI(req.url.replace("/", "")));
    if (!(await Access(url))) {
      res.status(404).send();
      return;
    }

    res.sendFile(url);
  });
  app.listen(80, (err?: any) => {
    if (err) throw err;
    console.log(`> FileShare Ready on localhost:${80}`);
  });
}
