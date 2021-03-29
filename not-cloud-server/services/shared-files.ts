import { Execute } from "./database";
import { v4 as Guid } from "uuid";
import { IsObject, IsString } from "@paulpopat/safe-type";

export async function ShareFile(path: string) {
  await Execute(async (db) => {
    await db.Perform(
      `INSERT INTO shared_files (id, path)
       VALUES ($1, $2)`,
      Guid(),
      path
    );
  });
}

export async function Access(path: string) {
  return await Execute(async (db) => {
    const result = await db.Query(
      `SELECT id, path FROM shared_files WHERE path = $1`,
      IsObject({ id: IsString, path: IsString }),
      path
    );

    await db.Perform(`DELETE FROM shared_files WHERE path = $1`, path);
    return result.length > 0;
  });
}

export async function IsShared(path: string) {
  return await Execute(async (db) => {
    const result = await db.Query(
      `SELECT id, path FROM shared_files WHERE path = $1`,
      IsObject({ id: IsString, path: IsString }),
      path
    );

    return result.length > 0;
  });
}
