import { IsObject, IsString } from "@paulpopat/safe-type";
import { Execute } from "./database";

export async function RegisterDomain(domain: string) {
  await Execute(async (db) => {
    await db.Perform(`DELETE FROM site_domains WHERE true`);
    await db.Perform(`INSERT INTO site_domains (domain) VALUES ($1)`, domain);
  });
}

export async function GetDomain() {
  try {
    const result = await Execute((db) =>
      db.QuerySingle(
        "SELECT domain FROM site_domains",
        IsObject({ domain: IsString })
      )
    );

    return result.domain;
  } catch {
    return "";
  }
}

export async function ClearDomain() {
  await Execute((db) => db.Perform(`DELETE FROM site_domains WHERE true`));
}
