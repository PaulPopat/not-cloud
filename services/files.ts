import { Assert, IsString } from "@paulpopat/safe-type";
import Fs from "fs-extra";
import Path from "path";
import { File } from "formidable";
import Cp from "child_process";

const root = process.env.ROOT_DIR as string;
Assert(IsString, root);

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
      created: stat.ctime.getTime(),
      edited: stat.ctime.getTime(),
      size: stat.size,
      download_url: Path.join(path, item),
    };
  }
}

export async function PrepareDownload(path: string) {
  const start = Path.join(root, path);
  if (!(await Fs.pathExists(start))) {
    return undefined;
  }

  const stat = await Fs.stat(start);
  return { stat, stream: Fs.createReadStream(start) };
}

export async function Download(path: string, file: File | File[]) {
  if (Array.isArray(file)) {
    throw new Error("Attempted to upload multiple files");
  }

  const start = Path.join(root, path);
  await Fs.writeFile(start, await Fs.readFile(file.path));
}

export async function Delete(path: string) {
  const start = Path.join(root, path);
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
      if (_ret.split("\n")[1]) {
        const arr = _ret.split("\n")[1].split(/[\s,]+/);
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
