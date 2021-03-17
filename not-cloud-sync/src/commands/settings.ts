import { app } from "electron";
import Path from "path";
import Fs from "fs-extra";
import { Assert } from "@paulpopat/safe-type";
import { IsSettings } from "../types";

const Location = Path.join(app.getPath("appData"), "not-cloud-sync", "settings.json");

export async function update(body: unknown) {
  Assert(IsSettings, body);

  await Fs.outputJson(Location, body);
}

export async function get() {
  if (!(await Fs.pathExists(Location))) {
    await Fs.outputJson(Location, { server_address: "", folders: [] });
  }

  const response = await Fs.readJson(Location);
  Assert(IsSettings, response);

  return response;
}
