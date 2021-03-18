import { PerformSync } from "../sync";
import { get as GetSettings } from "./settings";

let last_message = "";

export async function start() {
  const settings = await GetSettings();
  (async () => {
    try {
      for (const folder of settings.folders) {
        await PerformSync(
          settings.server_address,
          folder.local,
          folder.remote,
          (message) => (last_message = message)
        );
      }

      last_message = "Finished Sync";
    } catch (err) {
      console.error(err);
      last_message = err.toString();
    }
  })();

  return "Started";
}

export async function status() {
  return last_message;
}
