import { IsObject, IsString } from "@paulpopat/safe-type";
import { Execute } from "./database";
import { v4 as Guid } from "uuid";

type ResultPassword = {
  id: string;
  name: string;
  tags: { id: string; name: string }[];
};

export async function GetAllPasswords() {
  return await Execute(async (db) => {
    const result = [] as ResultPassword[];
    for (const password of await db.All(
      `SELECT id, name, username FROM Passwords`,
      IsObject({ id: IsString, name: IsString, username: IsString })
    )) {
      const tags = await db.All(
        `SELECT t.id, t.name
         FROM Password_Tags t
         INNER JOIN Password_Tag_Matches m ON m.tag = t.id
         WHERE m.password = $id`,
        IsObject({ id: IsString, name: IsString }),
        { $id: password.id }
      );

      result.push({ ...password, tags });
    }

    return result;
  });
}

export async function GetPassword(id: string) {
  return await Execute(async (db) => {
    const password = await db.Get(
      `SELECT id, name, url, username, password, description
       FROM Passwords
       WHERE id = $id`,
      IsObject({
        id: IsString,
        name: IsString,
        url: IsString,
        username: IsString,
        password: IsString,
        description: IsString,
      }),
      { $id: id }
    );

    const tags = await db.All(
      `SELECT t.id, t.name
         FROM Password_Tags t
         INNER JOIN Password_Tag_Matches m ON m.tag = t.id
         WHERE m.password = $id`,
      IsObject({ id: IsString, name: IsString }),
      { $id: password.id }
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
    await db.Run(
      `INSERT INTO Passwords (id, name, url, username, password, description)
       VALUES ($id, $name, $url, $username, $password, $description)`,
      {
        $id: id,
        $url: password.url,
        $name: password.name,
        $username: password.username,
        $password: password.password,
        $description: password.description,
      }
    );

    await db.ForAll(
      `INSERT INTO Password_Tag_Matches (id, password, tag) VALUES ($id, $password, $tag)`,
      password.tags
        .filter((t) => t !== "")
        .map((t) => ({ $id: Guid(), $password: id, $tag: t }))
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
    await db.Run(
      `UPDATE Passwords
       SET name = $name,
           url = $url,
           username = $username,
           password = $password,
           description = $description
       WHERE id = $id`,
      {
        $id: password.id,
        $name: password.name,
        $url: password.url,
        $username: password.username,
        $password: password.password,
        $description: password.description,
      }
    );

    await db.Run(`DELETE FROM Password_Tag_Matches WHERE password = $id`, {
      $id: password.id,
    });

    await db.ForAll(
      `INSERT INTO Password_Tag_Matches (id, password, tag) VALUES ($id, $password, $tag)`,
      password.tags.map((t) => ({
        $id: Guid(),
        $password: password.id,
        $tag: t,
      }))
    );
  });

  return await GetPassword(password.id);
}

export async function DeletePassword(id: string) {
  await Execute(async (db) => {
    await db.Run(`DELETE FROM Password_Tag_Matches WHERE password = $id`, {
      $id: id,
    });

    await db.Run(`DELETE FROM Passwords WHERE id = $id`, { $id: id });
  });
}

export async function GetAllTags() {
  return await Execute((db) =>
    db.All(
      `SELECT id, name FROM Password_Tags`,
      IsObject({ id: IsString, name: IsString })
    )
  );
}

export async function GetTag(id: string) {
  return await Execute(async (db) => {
    const tag = await db.Get(
      `SELECT id, name FROM Password_Tags WHERE id = $id`,
      IsObject({ id: IsString, name: IsString }),
      { $id: id }
    );

    const passwords = await db.All(
      `SELECT p.id, p.name
       FROM Passwords p
       INNER JOIN Password_Tag_Matches m ON m.password = p.id
       WHERE m.tag = $id`,
      IsObject({ id: IsString, name: IsString }),
      { $id: id }
    );

    return { ...tag, passwords };
  });
}

export async function AddTag(name: string) {
  const id = Guid();
  await Execute(async (db) => {
    await db.Run(`INSERT INTO Password_Tags (id, name) VALUES ($id, $name)`, {
      $id: id,
      $name: name,
    });
  });

  return await GetTag(id);
}

export async function UpdateTag(id: string, name: string) {
  await Execute(async (db) => {
    await db.Run(
      `UPDATE Password_Tags
       SET name = $name
       WHERE id = $id`,
      { $id: id, $name: name }
    );
  });

  return await GetTag(id);
}

export async function DeleteTag(id: string) {
  await Execute(async (db) => {
    await db.Run(
      `DELETE FROM Password_Tag_Matches
       WHERE tag = $id`,
      { $id: id }
    );

    await db.Run(
      `DELETE FROM Password_Tags
       WHERE id = $id`,
      { $id: id }
    );
  });
}
