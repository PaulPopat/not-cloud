import { StartFileShareServer } from "./file-share-server";
import { StartNextServer } from "./next-server";

const is_dev = process.env.NODE_ENV !== "production";
StartNextServer(is_dev).catch((e) => {
  console.error(e);
  process.exit(1);
});

StartFileShareServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
