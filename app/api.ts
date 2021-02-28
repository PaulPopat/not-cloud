import Build from "@paulpopat/api-interface";
import { DoNotCare, IsArray, IsObject, IsString } from "@paulpopat/safe-type";

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
          id: IsString,
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
          url: "/passwords/:password",
          parameters: { password: IsString },
          returns: DoNotCare,
        },
      },
    },
  },
  {
    base: "http://localhost:3000/api",
  }
);
