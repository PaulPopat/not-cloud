import {
  Checker,
  IsArray,
  IsBoolean,
  IsLiteral,
  IsNumber,
  IsObject,
  IsString,
  IsType,
  IsUnion,
} from "@paulpopat/safe-type";

export type Bookmark = {
  id: string;
  name: string;
  url: string;
};

export type BookmarksFolder = {
  id: string;
  name: string;
  folders: BookmarksFolder[];
  bookmarks: Bookmark[];
};

export const IsBookmark = IsObject({
  id: IsString,
  name: IsString,
  url: IsString,
});

export const IsBookmarksFolder: Checker<BookmarksFolder> = IsObject({
  id: IsString,
  name: IsString,
  folders: IsArray(((a: any, strict?: boolean) =>
    IsBookmarksFolder(a, strict)) as any) as Checker<BookmarksFolder[]>,
  bookmarks: IsArray(IsBookmark),
});

export const IsPasswordTag = IsObject({ id: IsString, name: IsString });

export type PasswordTag = IsType<typeof IsPasswordTag>;

export const IsExtendedPasswordTag = IsObject({
  id: IsString,
  name: IsString,
  passwords: IsArray(IsObject({ id: IsString, name: IsString })),
});

export const IsReducedPassword = IsObject({
  tags: IsArray(IsPasswordTag),
  id: IsString,
  name: IsString,
  username: IsString,
  url: IsString,
});

export const IsPassword = IsUnion(
  IsReducedPassword,
  IsObject({
    password: IsString,
    description: IsString,
  })
);

export const IsFsEntry = IsObject({
  name: IsString,
  extension: IsString,
  type: IsUnion(IsLiteral("directory"), IsLiteral("file")),
  created: IsNumber,
  edited: IsNumber,
  size: IsNumber,
  download_url: IsString,
  shared: IsBoolean,
});
