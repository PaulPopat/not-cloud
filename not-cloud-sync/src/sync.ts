import Fs from "fs-extra";
import Path from "path";
import {
  Assert,
  IsArray,
  IsObject,
  IsString,
  IsUnion,
  IsLiteral,
  IsNumber,
  IsBoolean,
} from "@paulpopat/safe-type";
import Axios from "axios";
import Request from "request";

type Directory = { path: string; url: string; files: NodeJS.Dict<Fs.Stats> };

async function WalkThrough(
  dir: string,
  relative_to: string,
  visit: (dir: Directory) => Promise<void>
) {
  const items = await Fs.readdir(dir);
  let url = Path.relative(relative_to, dir);
  if (url.startsWith("/")) {
    url = url.replace("/", "");
  }

  url = url.replace(/\\/gm, "/");
  /** @type {NodeJS.Dict<Fs.Stats>} */
  const files = {};
  const directories = [];
  for (const item of items) {
    if (item === "$RECYCLE.BIN") {
      continue;
    }

    try {
      const path = Path.join(dir, item);
      const stat = await Fs.stat(path);
      if (stat.isDirectory()) {
        directories.push(path);
      }

      files[item] = stat;
    } catch {}
  }

  await visit({ path: Path.normalize(Path.resolve(dir)), url, files });
  for (const directory of directories) {
    await WalkThrough(directory, relative_to, visit);
  }
}

export async function PerformSync(
  server_address: string,
  local_target: string,
  remote_target: string,
  progress_callback: (message: string) => void
) {
  const axios = Axios.create({ baseURL: server_address });

  try {
    await axios.post(`/api/files/path`, { add: remote_target });
  } catch {}

  /** @param {string} url  */
  const Urlify = (url) => encodeURIComponent(remote_target + "/" + url);
  /** @param {{ name: string, extension: string }} file */
  const FileName = ({ name, extension }) => name + extension;

  let file_count = 0;
  await WalkThrough(local_target, local_target, async (dir) => {
    progress_callback(`Checking over ${dir.path}`);
    let content = [];
    try {
      const { data } = await axios.get(`/api/files/path/${Urlify(dir.url)}`);
      Assert(
        IsArray(
          IsObject({
            name: IsString,
            extension: IsString,
            type: IsUnion(IsLiteral("directory"), IsLiteral("file")),
            created: IsNumber,
            edited: IsNumber,
            size: IsNumber,
            download_url: IsString,
            shared: IsBoolean,
          })
        ),
        data
      );

      content = data;
    } catch (err) {
      console.error(err);
      // Axios will always throw on a 404 so we swallow that error
    }

    // We need type inference
    Assert(
      IsArray(
        IsObject({
          name: IsString,
          extension: IsString,
          type: IsUnion(IsLiteral("directory"), IsLiteral("file")),
          created: IsNumber,
          edited: IsNumber,
          size: IsNumber,
          download_url: IsString,
          shared: IsBoolean,
        })
      ),
      content
    );

    for (const item of content) {
      if (!dir.files[FileName(item)]) {
        const target = dir.url + "/" + FileName(item);
        try {
          await axios.delete(`/api/files/path/${Urlify(target)}`);
        } catch (err) {
          console.error("Failed to delete " + target);
          console.error(err);
        }
      }
    }

    for (const name in dir.files) {
      const item = dir.files[name];
      if (item.isDirectory()) {
        if (
          !content.find((c) => FileName(c) === name && c.type === "directory")
        ) {
          try {
            await axios.post(`/api/files/path/${Urlify(dir.url)}`, {
              add: name,
            });
          } catch {
            // This shouldn't error but we don't care if it does.
            // A separate error will throw if a file fails and that
            // is a separate error and we terminate there.
          }
        }

        continue;
      }

      file_count++;
      const match = content.find(
        (c) => c.type === "file" && FileName(c) === name
      );
      if (!match || item.mtime.getTime() > match.edited) {
        await new Promise<void>((res, rej) => {
          progress_callback(
            `Uploading ${file_count} files - Current: ${Path.join(
              dir.path,
              name
            )}`
          );
          Request.post(
            {
              url: `${server_address}api/files/upload?path=${Urlify(dir.url)}`,
              formData: {
                file: Fs.createReadStream(Path.join(dir.path, name)),
              },
            },
            (err, response) => {
              if (err || response.statusCode > 399) {
                progress_callback(
                  "An error has occered for " + Path.join(dir.path, name)
                );
              }

              res();
            }
          );
        });
      }
    }
  });

  progress_callback("Done");
}
