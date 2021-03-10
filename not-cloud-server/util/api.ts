import { Assert, Checker } from "@paulpopat/safe-type";
import { NextApiRequest, NextApiResponse } from "next";

type Response = {
  status: number;
  headers?: NodeJS.Dict<string | string[]>;
  body?: unknown;
};

type Handler = (query: unknown, body: unknown) => Promise<Response>;

export function BuildApi(schema: NodeJS.Dict<Handler>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const route = schema[req.method ?? ""];
    if (!route) {
      res.status(404).send("Not Found");
      return;
    }

    try {
      const query = req.query;
      const body = req.body;

      const result = await route(query, body);
      if (result.headers) {
        for (const header in result.headers) {
          const value = result.headers[header];
          res.setHeader(header, value ?? "");
        }
      }

      res.status(result.status).json(result.body);
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  };
}
