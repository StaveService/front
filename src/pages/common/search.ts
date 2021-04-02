import axios from "axios";
import React, { SetStateAction } from "react";

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
  axios
    .get(route, { params: { q: query } })
    .then((res) => setState(res.data))
    .catch((err) => console.log(err))
    .finally(() => setLoading && setLoading(false));
}

const a = "";
export default a;
