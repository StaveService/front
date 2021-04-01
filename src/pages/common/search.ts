import axios from "axios";
import React, { SetStateAction } from "react";

export function search<T>(
  value: string,
  route: string,
  query: { [key: string]: string },
  setState: React.Dispatch<SetStateAction<T>>
): void {
  if (!value) return;
  axios
    .get(route, { params: { q: query } })
    .then((res) => setState(res.data))
    .catch((err) => console.log(err));
}

const a = "";
export default a;
