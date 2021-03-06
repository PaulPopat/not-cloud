import { IsObject, IsString } from "@paulpopat/safe-type";
import Fs from "fs-extra";
import Path from "path";
import { File } from "formidable";
import Cp from "child_process";
import Glob from "glob";
import { Execute } from "./database";
import { IsShared } from "./shared-files";

const root = "/file-store";

export async function* GetDirectory(path: string) {
  const start = Path.join(root, path);
  await Fs.ensureDir(start);
  const content = await Fs.readdir(start);

  for (const item of content) {
    const location = Path.join(start, item);
    const stat = await Fs.stat(location);
    yield {
      name: Path.basename(location, Path.extname(location)),
      extension: Path.extname(location),
      type: stat.isDirectory() ? ("directory" as const) : ("file" as const),
      created: stat.birthtime.getTime(),
      edited: stat.mtime.getTime(),
      size: stat.size,
      download_url: Path.join(path, item),
      shared: await IsShared(location),
    };
  }
}

export function GetLocalPath(path: string) {
  return Path.join(root, path);
}

export async function PrepareDownload(path: string) {
  const start = GetLocalPath(path);
  if (!(await Fs.pathExists(start))) {
    return undefined;
  }

  const stat = await Fs.stat(start);
  return { stat, stream: Fs.createReadStream(start) };
}

export async function Exists(path: string) {
  const start = Path.join(root, path);
  return await Fs.pathExists(start);
}

export async function Delete(path: string) {
  const start = Path.join(root, path);
  if (start.endsWith(".ncloud")) {
    await Execute(async (db) => {
      await db.Perform(`DELETE FROM documents WHERE path = $1`, start);
    });
  }

  await Fs.remove(start);
}

export async function Rename(path: string, to: string) {
  const start = Path.join(root, path);
  await Fs.rename(start, Path.join(Path.dirname(start), to));
}

export async function CreateDirectory(path: string, add: string) {
  const start = Path.join(root, path);
  await Fs.mkdir(Path.join(start, add));
}

export function GetSpace() {
  return new Promise<{ used: number; total: number }>((res, rej) => {
    const ps = Cp.spawn("df", ["-k", root]);
    let _ret = "";

    ps.stdout.on("data", function (data) {
      _ret = data.toString();
    });

    ps.on("error", function (err) {
      rej(err);
    });

    ps.on("close", function () {
      // Docker likes to put the disk space on a different line on the first run.
      const data = _ret.split("\n")[1] || _ret.split("\n")[0];
      if (data) {
        const arr = data.split(/[\s,]+/);
        const used = parseInt(arr[2].replace("", "")) * 1024;
        res({
          used: used,
          total: parseInt(arr[3].replace("", "")) * 1024 + used,
        });
      }

      rej("No storage info");
    });
  });
}

export function Search(term: string) {
  return new Promise<
    {
      name: string;
      extension: string;
      type: "directory" | "file";
      created: number;
      edited: number;
      size: number;
      download_url: string;
    }[]
  >(async (res, rej) => {
    const process_paths = async (paths: string[]) => {
      const result = [];
      for (const match of paths) {
        if (!(await Fs.pathExists(match))) {
          if (match.endsWith(".ncloud")) {
            await Execute(async (db) => {
              await db.Perform(`DELETE FROM documents WHERE path = $1`, match);
            });
          }

          continue;
        }

        const stat = await Fs.stat(match);
        if (!stat.isFile()) {
          if (match.endsWith(".ncloud")) {
            await Execute(async (db) => {
              await db.Perform(`DELETE FROM documents WHERE path = $1`, match);
            });
          }

          continue;
        }

        result.push({
          name: Path.basename(match, Path.extname(match)),
          extension: Path.extname(match),
          type: stat.isDirectory() ? ("directory" as const) : ("file" as const),
          created: stat.ctime.getTime(),
          edited: stat.mtime.getTime(),
          size: stat.size,
          download_url: Path.relative(root, match).replace(/\\/gm, "/"),
          shared: await IsShared(match),
        });
      }

      return result;
    };

    if (term === "*.ncloud") {
      const paths = await Execute((db) =>
        db.Query(`SELECT path FROM documents`, IsObject({ path: IsString }))
      );
      res(await process_paths(paths.map((p) => p.path)));
      return;
    }

    Glob(Path.join(root, "**", term), async (err, matches) => {
      if (err) {
        rej(err);
        return;
      }

      res(await process_paths(matches));
    });
  });
}
