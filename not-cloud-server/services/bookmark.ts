import { IsObject, IsString } from "@paulpopat/safe-type";
import { Linq } from "../util/linq";
import { Database, Execute } from "./database";
import { v4 as Guid } from "uuid";

type Bookmark = {
  id: string;
  name: string;
  url: string;
};

type BookmarksFolder = {
  id: string;
  name: string;
  folders: BookmarksFolder[];
  bookmarks: Bookmark[];
};

function GetBookmarks(db: Database, folder: string): Promise<Bookmark[]> {
  return db.Query(
    `SELECT id, name, url
     FROM bookmarks
     WHERE folder = $1`,
    IsObject({ id: IsString, name: IsString, url: IsString }),
    folder
  );
}

function GetFolders(db: Database, parent: string): Promise<BookmarksFolder[]> {
  return Linq(
    db.Query(
      `SELECT id, name
       FROM bookmark_folders
       WHERE parent = $1`,
      IsObject({ id: IsString, name: IsString }),
      parent
    )
  )
    .Select(async (row) => ({
      id: row.id,
      name: row.name,
      folders: await GetFolders(db, row.id),
      bookmarks: await GetBookmarks(db, row.id),
    }))
    .Execute();
}

export function GetBookmarksBar() {
  return Execute(async (db) => ({
    folders: await Linq(
      db.Query(
        `SELECT id, name
         FROM bookmark_folders
         WHERE parent IS NULL`,
        IsObject({ id: IsString, name: IsString })
      )
    )
      .Select(async (row) => ({
        id: row.id,
        name: row.name,
        folders: await GetFolders(db, row.id),
        bookmarks: await GetBookmarks(db, row.id),
      }))
      .Execute(),
    bookmarks: await db.Query(
      `SELECT id, name, url
       FROM bookmarks
       WHERE folder IS NULL`,
      IsObject({ id: IsString, name: IsString, url: IsString })
    ),
  }));
}

export async function AddBookmark(
  name: string,
  url: string,
  folder: string | null | undefined
) {
  const id = Guid();
  await Execute(async (db) => {
    if (folder) {
      await db.Perform(
        `INSERT INTO bookmarks (id, name, url, folder)
         VALUES ($1, $2, $3, $4)`,
        id,
        name,
        url,
        folder
      );
    } else {
      await db.Perform(
        `INSERT INTO bookmarks (id, name, url)
         VALUES ($1, $2, $3)`,
        id,
        name,
        url
      );
    }
  });
}

export async function UpdateBookmark(id: string, name: string, url: string) {
  await Execute((db) =>
    db.Perform(
      `UPDATE bookmarks
       SET name = $1,
           url = $2
       WHERE id = $3`,
      name,
      url,
      id
    )
  );
}

export async function DeleteBookmark(id: string) {
  await Execute((db) => db.Perform(`DELETE FROM bookmarks WHERE id = $1`, id));
}

export async function AddFolder(name: string, parent: string | null | undefined) {
  const id = Guid();
  await Execute(async (db) => {
    if (parent) {
      await db.Perform(
        `INSERT INTO bookmark_folders (id, name, parent)
         VALUES ($1, $2, $3)`,
        id,
        name,
        parent
      );
    } else {
      await db.Perform(
        `INSERT INTO bookmarks (id, name)
         VALUES ($1, $2)`,
        id,
        name
      );
    }
  });
}

export async function UpdateFolder(id: string, name: string) {
  await Execute((db) =>
    db.Perform(
      `UPDATE bookmark_folders
       SET name = $1
       WHERE id = $3`,
      name,
      id
    )
  );
}

export async function DeleteFolder(id: string) {
  return await Execute(async (db) => {
    if (
      (await GetBookmarks(db, id)).length ||
      (await GetFolders(db, id)).length
    ) {
      return "Not Empty" as const;
    }

    await db.Perform(`DELETE FROM bookmark_folders WHERE id = $1`, id);
    return "Deleted" as const;
  });
}
