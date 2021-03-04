import Build from "@paulpopat/api-interface";
import {
  DoNotCare,
  IsArray,
  IsLiteral,
  IsNumber,
  IsObject,
  IsString,
  IsUnion,
} from "@paulpopat/safe-type";

export const Api = Build(
  {
    Passwords: {
      GetAll: {
        method: "GET",
        url: "/passwords",
        returns: IsArray(
          IsObject({
            id: IsString,
            name: IsString,
            url: IsString,
            username: IsString,
            tags: IsArray(IsObject({ id: IsString, name: IsString })),
          })
        ),
      },
      Get: {
        method: "GET",
        url: "/passwords/:password",
        parameters: { password: IsString },
        returns: IsObject({
          tags: IsArray(
            IsObject({
              id: IsString,
              name: IsString,
            })
          ),
          id: IsString,
          name: IsString,
          url: IsString,
          username: IsString,
          password: IsString,
          description: IsString,
        }),
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
        returns: IsObject({
          tags: IsArray(
            IsObject({
              id: IsString,
              name: IsString,
            })
          ),
          id: IsString,
          name: IsString,
          url: IsString,
          username: IsString,
          password: IsString,
          description: IsString,
        }),
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
        returns: IsObject({
          tags: IsArray(
            IsObject({
              id: IsString,
              name: IsString,
            })
          ),
          id: IsString,
          name: IsString,
          url: IsString,
          username: IsString,
          password: IsString,
          description: IsString,
        }),
      },
      Delete: {
        method: "DELETE",
        url: "/passwords/:password",
        parameters: { password: IsString },
        returns: DoNotCare,
      },
      Tags: {
        GetAll: {
          method: "GET",
          url: "/password-tags",
          returns: IsArray(
            IsObject({
              id: IsString,
              name: IsString,
            })
          ),
        },
        Get: {
          method: "GET",
          url: "/password-tags/:tag",
          parameters: { tag: IsString },
          returns: IsObject({
            passwords: IsArray(
              IsObject({
                id: IsString,
                name: IsString,
              })
            ),
            id: IsString,
            name: IsString,
          }),
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
          returns: IsObject({
            passwords: IsArray(
              IsObject({
                id: IsString,
                name: IsString,
              })
            ),
            id: IsString,
            name: IsString,
          }),
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
        returns: IsArray(
          IsObject({
            name: IsString,
            extension: IsString,
            type: IsUnion(IsLiteral("directory"), IsLiteral("file")),
            created: IsNumber,
            edited: IsNumber,
            size: IsNumber,
            download_url: IsString,
          })
        ),
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
        returns: IsArray(
          IsObject({
            name: IsString,
            extension: IsString,
            type: IsUnion(IsLiteral("directory"), IsLiteral("file")),
            created: IsNumber,
            edited: IsNumber,
            size: IsNumber,
            download_url: IsString,
          })
        ),
      },
    },
  },
  {
    base: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api`,
  }
);
