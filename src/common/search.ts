import axios from "axios";
import React, { SetStateAction } from "react";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function search<T>(
  route: string,
  query: { [key: string]: string },
  setState: React.Dispatch<SetStateAction<T[]>>,
  setLoading?: React.Dispatch<SetStateAction<boolean>>
): void {
  if (!Object.values(query)[0]) {
    setState([]);
    return;
  }
  if (setLoading) setLoading(true);
  // eslint-disable-next-line no-void
  // void (async () => {
  // await sleep(1000);
  axios
    .get(route, { params: { q: query } })
    .then((res) => setState(res.data))
    .catch((err) => console.log(err))
    .finally(() => setLoading && setLoading(false));
  // })();
}

const a = "";
export default a;
