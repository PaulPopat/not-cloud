import { Client } from "pg";
import Fs from "fs-extra";
import Path from "path";
import { Assert, Checker, IsArray } from "@paulpopat/safe-type";

const updates_path = "./update-scripts";

async function GetDb() {
  const client = new Client({
    user: "not_cloud",
    host: "db",
    database: "not_cloud",
    password: "password",
    port: 5432,
  });
  await client.connect();
  return client;
}

type Parameter = string | number | boolean;

async function UpdateDatabase() {
  const db = await GetDb();
  const current = await (async () => {
    try {
      const res = await db.query("SELECT version FROM schema_version");
      return res.rows[0].version as number;
    } catch {
      await db.query(
        "CREATE TABLE schema_version (version integer PRIMARY KEY)"
      );
      await db.query("INSERT INTO schema_version (version) VALUES (0)");
      return 0;
    }
  })();
  const scripts = await Fs.readdir(updates_path);
  if (scripts.length > current) {
    const to_execute = [] as string[];
    for (let i = current; i < scripts.length; i++) {
      to_execute.push(
        await Fs.readFile(Path.join(updates_path, scripts[i]), "utf-8")
      );
    }

    try {
      for (const script of to_execute) {
        await db.query(script);
      }
    } finally {
      await db.query("DELETE FROM schema_version WHERE true");
      await db.query("INSERT INTO schema_version (version) VALUES ($1)", [
        scripts.length,
      ]);
      await db.end();
    }
  }
}

function Process(db: Client) {
  return {
    async Perform(query: string, ...params: Parameter[]) {
      await db.query(query, params);
    },
    async PerformAll(query: string, params: Parameter[][]) {
      for (const param of params) {
        await db.query(query, param);
      }
    },
    async Query<T>(query: string, check: Checker<T>, ...params: Parameter[]) {
      const response = await db.query(query, params);
      const result = response.rows;
      if (!result) {
        return [];
      }

      Assert(IsArray(check), result);
      return result;
    },
    async QuerySingle<T>(
      query: string,
      check: Checker<T>,
      ...params: Parameter[]
    ) {
      const response = await db.query(query, params);
      const result = response.rows;
      Assert(IsArray(check), result);
      if (result.length > 1) {
        throw new Error("More than one match for " + query);
      } else if (result.length === 0) {
        throw new Error("No matches for " + query);
      }

      return result[0];
    },
  };
}

export type Database = ReturnType<typeof Process>;

let updated = false;
export async function Execute<T>(action: (db: Database) => Promise<T>) {
  if (!updated) {
    await UpdateDatabase();
  }

  const db = await GetDb();
  updated = true;
  let result: any = undefined;
  try {
    result = await action(Process(db));
  } finally {
    await db.end();
  }

  return result as T;
}
