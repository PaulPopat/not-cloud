import Fs from "fs-extra";
import Mammoth from "mammoth";
import { Execute } from "./database";
import { GetLocalPath } from "./files";

export async function WriteFileString(path: string, text: string) {
  const start = GetLocalPath(path);
  if (start.endsWith(".ncloud")) {
    await Execute(async (db) => {
      await db.Perform(
        `INSERT INTO documents (path, edited)
         VALUES ($1, $2)
         ON CONFLICT (path)
         DO
           UPDATE SET edited = EXCLUDED.edited`,
        start,
        Math.floor(new Date().getTime() / 60000)
      );
    });
  }

  await Fs.outputFile(start, text, "utf-8");
}

export async function GetFileString(path: string) {
  const start = GetLocalPath(path);
  if (!(await Fs.pathExists(start))) {
    return undefined;
  }

  return await Fs.readFile(start, "utf-8");
}

export async function ToHtml(path: string) {
  const start = GetLocalPath(path);
  if (!Fs.pathExists(start) || !start.endsWith(".docx")) {
    return undefined;
  }

  const result = await Mammoth.convertToHtml({ path: start });
  return result.value;
}
