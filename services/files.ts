import { Assert, IsString } from "@paulpopat/safe-type";
import Fs from "fs-extra";
import Path from "path";

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
