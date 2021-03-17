import { PerformSync } from "../sync";
import { get as GetSettings } from "./settings";
import { app } from "electron";
import Path from "path";
import Fs from "fs-extra";

const Location = Path.join(
  app.getPath("appData"),
  "not-cloud-sync",
  "last-run.lock"
);
let last_message = "";

export async function start() {
  const settings = await GetSettings();
  const last_run = (await Fs.pathExists(Location))
    ? parseInt(await Fs.readFile(Location, "utf-8"))
    : 0;
  (async () => {
    for (const folder of settings.folders) {
      await PerformSync(
        settings.server_address,
        folder.local,
        folder.remote,
        last_run,
        (message) => (last_message = message)
      );
    }
  })()
    .catch((err) => {
      console.error(err);
      last_message = err.toString();
    })
    .then(() => {
      Fs.writeFile(Location, new Date().getTime().toString());
      last_message = "Finished Sync";
    });

  return "Started";
}

export async function status() {
  return last_message;
}
