import React from "react";

export function UseAsync<T>(initial: () => Promise<T>) {
  const state = React.useState<T>();

  React.useEffect(() => {
    initial().then(state[1]);
  }, [true]);

  return state;
}
