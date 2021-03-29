import express from "express";
import next from "next";

export async function StartNextServer(dev: boolean) {
  const app = next({ dev });
  const handle = app.getRequestHandler();
  const port = 3000;

  await app.prepare();
  const server = express();
  server.all("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> NextJs Ready on localhost:${port}`);
  });
}
