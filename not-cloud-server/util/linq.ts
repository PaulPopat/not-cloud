export function Linq<TInput>(input: TInput[] | Promise<TInput[]>) {
  const internal = <TInternal>(i: () => AsyncGenerator<TInternal>) => {
    return {
      Select: <TResult>(
        select: (item: TInternal) => TResult | Promise<TResult>
      ) => {
        return internal(async function* () {
          for await (const item of i()) {
            yield await Promise.resolve(select(item));
          }
        });
      },
      Execute: async () => {
        const result = [];
        for await (const item of i()) {
          result.push(item);
        }

        return result;
      },
    };
  };

  return internal(async function* () {
    for (const item of await Promise.resolve(input)) {
      yield item;
    }
  });
}
