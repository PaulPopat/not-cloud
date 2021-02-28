import Sql from "sqlite3";
import Fs from "fs-extra";
import Path from "path";
import { Assert, Checker, IsArray } from "@paulpopat/safe-type";

const db_path = "./.res/db.db";
const ver_path = "./.res/ver.db.lock";
const updates_path = "./update-scripts";

async function GetDb() {
  if (!(await Fs.pathExists(Path.dirname(db_path)))) {
    await Fs.mkdir(Path.dirname(db_path));
  }

  const sqlite = Sql.verbose();
  return new sqlite.Database(db_path);
}

async function UpdateDatabase() {
  const db = await GetDb();
  const current = (await Fs.pathExists(ver_path))
    ? parseInt(await Fs.readFile(ver_path, "utf-8"))
    : 0;
  const scripts = await Fs.readdir(updates_path);
  if (scripts.length > current) {
    const to_execute = [] as string[];
    for (let i = current; i < scripts.length; i++) {
      to_execute.push(
        await Fs.readFile(Path.join(updates_path, scripts[i]), "utf-8")
      );
    }

    await Fs.writeFile(ver_path, scripts.length.toString());

    try {
      db.serialize(() => {
        for (const script of to_execute) {
          db.exec(script);
        }
      });
    } finally {
      db.close();
    }
  }
}

type QueryParams = NodeJS.Dict<string | number>;

function Process(db: Sql.Database) {
  return {
    Get<T>(command: string, check: Checker<T>, params?: QueryParams) {
      return new Promise<T>((res, rej) => {
        if (params) {
          db.all(command, params, (err, rows) => {
            if (err) {
              rej(err);
              return;
            }

            if (rows.length === 0) {
              throw new Error("No match for get " + command);
            }

            if (rows.length > 1) {
              throw new Error("More than one match for get " + command);
            }

            Assert(IsArray(check), rows);
            res(rows[0]);
          });
        } else {
          db.all(command, (err, rows) => {
            if (err) {
              rej(err);
              return;
            }

            if (rows.length === 0) {
              throw new Error("No match for get " + command);
            }

            if (rows.length > 1) {
              throw new Error("More than one match for get " + command);
            }

            Assert(IsArray(check), rows);
            res(rows[0]);
          });
        }
      });
    },
    All<T>(command: string, check: Checker<T>, params?: QueryParams) {
      return new Promise<T[]>((res, rej) => {
        if (params) {
          db.all(command, params, (err, rows) => {
            if (err) {
              rej(err);
            } else {
              Assert(IsArray(check), rows);
              res(rows);
            }
          });
        } else {
          db.all(command, (err, rows) => {
            if (err) {
              rej(err);
            } else {
              Assert(IsArray(check), rows);
              res(rows);
            }
          });
        }
      });
    },
    Run(command: string, params: QueryParams) {
      return new Promise<void>((res, rej) => {
        db.run(command, params, (err) => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        });
      });
    },
    async ForAll(command: string, params: QueryParams[]) {
      const stmt = await new Promise<Sql.Statement>((res, rej) => {
        db.prepare(command, function (err) {
          if (err) {
            rej(err);
          } else {
            res(this);
          }
        });
      });

      for (const item of params) {
        await new Promise<void>((res, rej) => {
          stmt.run(item, (err) => {
            if (err) {
              rej(err);
            } else {
              res();
            }
          });
        });
      }

      await new Promise<void>((res, rej) => {
        stmt.finalize((err) => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        });
      });
    },
  };
}

let updated = false;
export async function Execute<T>(
  action: (db: ReturnType<typeof Process>) => Promise<T>
) {
  if (!updated) {
    await UpdateDatabase();
  }

  const db = await GetDb();
  updated = true;
  let result: any = undefined;
  try {
    result = await action(Process(db));
  } finally {
    db.close();
  }

  return result as T;
}
