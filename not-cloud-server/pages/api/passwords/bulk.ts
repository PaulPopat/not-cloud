import { Assert, IsArray, IsObject, IsString } from "@paulpopat/safe-type";
import {
  AddPassword,
  AddTag,
  GetAllPasswords,
  GetAllTags,
  GetPassword,
} from "../../../services/password";
import { BuildApi } from "../../../util/api";
import { Linq } from "../../../util/linq";

export default BuildApi({
  GET: async () => ({
    status: 200,
    body: await Linq(await GetAllPasswords())
      .Select((p) => GetPassword(p.id))
      .Execute(),
  }),
  POST: async (_, body) => {
    Assert(
      IsArray(
        IsObject({
          id: IsString,
          name: IsString,
          url: IsString,
          username: IsString,
          password: IsString,
          description: IsString,
          tags: IsArray(IsObject({ id: IsString, name: IsString })),
        })
      ),
      body
    );

    const tags = await GetAllTags();
    for (const password of body) {
      const input_tags = await Linq(password.tags)
        .Select(async (t) => {
          const current = tags.find((c) => c.name === t.name);
          if (!current) {
            const input = await AddTag(t.name);
            tags.push(input);
            return input.id;
          }

          return current.id;
        })
        .Execute();

      await AddPassword({
        name: password.name,
        url: password.url,
        username: password.username,
        password: password.password,
        description: password.description,
        tags: input_tags,
      });
    }

    return { status: 201 };
  },
});
