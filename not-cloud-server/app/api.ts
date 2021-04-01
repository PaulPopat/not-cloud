import Build from "@paulpopat/api-interface";
import {
  DoNotCare,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Optional,
} from "@paulpopat/safe-type";
import {
  IsBookmark,
  IsExtendedPasswordTag,
  IsFsEntry,
  IsPassword,
  IsPasswordTag,
  IsReducedPassword,
} from "./types";

export const Api = Build(
  {
    Passwords: {
      GetAll: {
        method: "GET",
        url: "/passwords",
        returns: IsArray(IsReducedPassword),
      },
      Get: {
        method: "GET",
        url: "/passwords/:password",
        parameters: { password: IsString },
        returns: IsPassword,
      },
      Post: {
        method: "POST",
        url: "/passwords",
        body: IsObject({
          name: IsString,
          url: IsString,
          username: IsString,
          password: IsString,
          description: IsString,
          tags: IsArray(IsString),
        }),
        returns: IsPassword,
      },
      Put: {
        method: "PUT",
        url: "/passwords/:password",
        parameters: { password: IsString },
        body: IsObject({
          name: IsString,
          url: IsString,
          username: IsString,
          password: IsString,
          description: IsString,
          tags: IsArray(IsString),
        }),
        returns: IsPassword,
      },
      Delete: {
        method: "DELETE",
        url: "/passwords/:password",
        parameters: { password: IsString },
        returns: DoNotCare,
      },
      BulkExport: {
        method: "GET",
        url: "/passwords/bulk",
        returns: IsArray(IsPassword),
      },
      BulkImport: {
        method: "POST",
        url: "/passwords/bulk",
        body: IsArray(IsPassword),
        returns: DoNotCare,
      },
      Tags: {
        GetAll: {
          method: "GET",
          url: "/password-tags",
          returns: IsArray(IsPasswordTag),
        },
        Get: {
          method: "GET",
          url: "/password-tags/:tag",
          parameters: { tag: IsString },
          returns: IsExtendedPasswordTag,
        },
        Post: {
          method: "POST",
          url: "/password-tags",
          body: IsObject({
            name: IsString,
          }),
          returns: IsObject({
            id: IsString,
            name: IsString,
          }),
        },
        Put: {
          method: "PUT",
          url: "/password-tags/:tag",
          parameters: { tag: IsString },
          body: IsObject({
            name: IsString,
          }),
          returns: IsExtendedPasswordTag,
        },
        Delete: {
          method: "DELETE",
          url: "/password-tags/:tag",
          parameters: { tag: IsString },
          returns: DoNotCare,
        },
      },
    },
    Files: {
      ReadDirectory: {
        method: "GET",
        url: "/files/path/:path",
        parameters: { path: IsString },
        returns: IsArray(IsFsEntry),
      },
      Delete: {
        method: "DELETE",
        url: "/files/path/:path",
        parameters: { path: IsString },
        returns: DoNotCare,
      },
      Rename: {
        method: "PUT",
        url: "/files/path/:path",
        parameters: { path: IsString },
        body: IsObject({ to: IsString }),
        returns: DoNotCare,
      },
      MakeDirectory: {
        method: "POST",
        url: "/files/path/:path",
        parameters: { path: IsString },
        body: IsObject({ add: IsString }),
        returns: DoNotCare,
      },
      FreeSpace: {
        method: "GET",
        url: "/files/diskspace",
        returns: IsObject({ used: IsNumber, total: IsNumber }),
      },
      NCloudFile: {
        Get: {
          method: "GET",
          url: "/files/ncloud/:path",
          parameters: { path: IsString },
          returns: IsObject({ data: IsString }),
        },
        Write: {
          method: "PUT",
          url: "/files/ncloud/:path",
          parameters: { path: IsString },
          body: IsObject({ data: IsString }),
          returns: DoNotCare,
        },
      },
      Search: {
        method: "GET",
        url: "/files/search",
        parameters: { term: IsString },
        returns: IsArray(IsFsEntry),
      },
      Share: {
        method: "POST",
        url: "/files/share/:path",
        parameters: { path: IsString },
        body: DoNotCare,
        returns: IsString,
      },
      UnShare: {
        method: "DELETE",
        url: "/files/share/:path",
        parameters: { path: IsString },
        returns: IsString,
      },
    },
    Settings: {
      Get: {
        method: "GET",
        url: "/site-settings",
        returns: IsObject({ domain: IsString }),
      },
      Update: {
        method: "PUT",
        url: "/site-settings",
        body: IsObject({ domain: IsString }),
        returns: IsObject({ domain: IsString }),
      },
    },
    Bookmarks: {
      GetAll: {
        method: "GET",
        url: "/bookmarks",
        returns: IsArray(IsBookmark),
      },
      Add: {
        method: "POST",
        url: "/bookmarks",
        body: IsObject({
          name: IsString,
          url: IsString,
          folder: Optional(IsString),
        }),
        returns: DoNotCare,
      },
      Update: {
        method: "PUT",
        url: "/bookmarks/:id",
        parameters: { id: IsString },
        body: IsObject({ name: IsString, url: IsString }),
        returns: DoNotCare,
      },
      Delete: {
        method: "DELETE",
        url: "/bookmarks/:id",
        parameters: { id: IsString },
        returns: DoNotCare,
      },
      Folders: {
        Add: {
          method: "POST",
          url: "/bookmark-folders",
          body: IsObject({
            name: IsString,
            parent: Optional(IsString),
          }),
          returns: DoNotCare,
        },
        Update: {
          method: "PUT",
          url: "/bookmark-folders/:id",
          parameters: { id: IsString },
          body: IsObject({ name: IsString }),
          returns: DoNotCare,
        },
        Delete: {
          method: "DELETE",
          url: "/bookmark-folders/:id",
          parameters: { id: IsString },
          returns: DoNotCare,
        },
      },
    },
  },
  {
    base: `${process.browser ? "" : "http://localhost:3000"}/api`,
  }
);
