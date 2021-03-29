import { IsObject, IsString } from "@paulpopat/safe-type";
import { Execute } from "./database";
import { v4 as Guid } from "uuid";

export async function GetAllPasswords() {
  return await Execute(async (db) => {
    const result = [];
    for (const password of await db.Query(
      `SELECT id, name, username, url FROM passwords`,
      IsObject({
        id: IsString,
        name: IsString,
        username: IsString,
        url: IsString,
      })
    )) {
      const tags = await db.Query(
        `SELECT t.id, t.name
         FROM password_tags t
         INNER JOIN password_tag_matches m ON m.tag = t.id
         WHERE m.password = $1`,
        IsObject({ id: IsString, name: IsString }),
        password.id
      );

      result.push({ ...password, tags });
    }

    return result;
  });
}

export async function GetPassword(id: string) {
  return await Execute(async (db) => {
    const password = await db.QuerySingle(
      `SELECT id, name, url, username, password, description
       FROM passwords
       WHERE id = $1`,
      IsObject({
        id: IsString,
        name: IsString,
        url: IsString,
        username: IsString,
        password: IsString,
        description: IsString,
      }),
      id
    );

    const tags = await db.Query(
      `SELECT t.id, t.name
       FROM password_tags t
       INNER JOIN password_tag_matches m ON m.tag = t.id
       WHERE m.password = $1`,
      IsObject({ id: IsString, name: IsString }),
      password.id
    );

    return { ...password, tags };
  });
}

type AddPassword = {
  name: string;
  url: string;
  username: string;
  password: string;
  description: string;
  tags: string[];
};

export async function AddPassword(password: AddPassword) {
  const id = Guid();
  await Execute(async (db) => {
    await db.Perform(
      `INSERT INTO passwords (id, name, url, username, password, description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      id,
      password.name,
      password.url,
      password.username,
      password.password,
      password.description
    );

    await db.PerformAll(
      `INSERT INTO password_tag_matches (id, password, tag) VALUES ($1, $2, $3)`,
      password.tags.filter((t) => t !== "").map((t) => [Guid(), id, t])
    );
  });

  return await GetPassword(id);
}

type UpdatePassword = {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  description: string;
  tags: string[];
};

export async function UpdatePassword(password: UpdatePassword) {
  await Execute(async (db) => {
    await db.Perform(
      `UPDATE passwords
       SET name = $1,
           url = $2,
           username = $3,
           password = $4,
           description = $5
       WHERE id = $6`,
      password.name,
      password.url,
      password.username,
      password.password,
      password.description,
      password.id
    );

    await db.Perform(
      `DELETE FROM password_tag_matches WHERE password = $1`,
      password.id
    );

    await db.PerformAll(
      `INSERT INTO password_tag_matches (id, password, tag) VALUES ($1, $2, $3)`,
      password.tags.map((t) => [Guid(), password.id, t])
    );
  });

  return await GetPassword(password.id);
}

export async function DeletePassword(id: string) {
  await Execute(async (db) => {
    await db.Perform(
      `DELETE FROM password_tag_matches WHERE password = $1`,
      id
    );

    await db.Perform(`DELETE FROM Passwords WHERE id = $1`, id);
  });
}

export async function GetAllTags() {
  return await Execute((db) =>
    db.Query(
      `SELECT id, name FROM Password_Tags`,
      IsObject({ id: IsString, name: IsString })
    )
  );
}

export async function GetTag(id: string) {
  return await Execute(async (db) => {
    const tag = await db.QuerySingle(
      `SELECT id, name FROM Password_Tags WHERE id = $1`,
      IsObject({ id: IsString, name: IsString }),
      id
    );

    const passwords = await db.Query(
      `SELECT p.id, p.name
       FROM Passwords p
       INNER JOIN Password_Tag_Matches m ON m.password = p.id
       WHERE m.tag = $1`,
      IsObject({ id: IsString, name: IsString }),
      id
    );

    return { ...tag, passwords };
  });
}

export async function AddTag(name: string) {
  const id = Guid();
  await Execute(async (db) => {
    await db.Perform(
      `INSERT INTO Password_Tags (id, name) VALUES ($1, $2)`,
      id,
      name
    );
  });

  return await GetTag(id);
}

export async function UpdateTag(id: string, name: string) {
  await Execute(async (db) => {
    await db.Perform(
      `UPDATE Password_Tags
       SET name = $1
       WHERE id = $2`,
      name,
      id
    );
  });

  return await GetTag(id);
}

export async function DeleteTag(id: string) {
  await Execute(async (db) => {
    await db.Perform(
      `DELETE FROM Password_Tag_Matches
       WHERE tag = $1`,
      id
    );

    await db.Perform(
      `DELETE FROM Password_Tags
       WHERE id = $1`,
      id
    );
  });
}
