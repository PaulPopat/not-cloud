import { IsObject, IsString, IsArray } from "@paulpopat/safe-type";

export const IsSettings = IsObject({
  server_address: IsString,
  folders: IsArray(IsObject({ local: IsString, remote: IsString })),
});
