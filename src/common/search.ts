import axios, { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import React, { SetStateAction } from "react";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "react-query";

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

export const useSearchMutation = <T>(
  route: string,
  options?: UseMutationOptions<
    AxiosResponse<T>,
    unknown,
    { [key: string]: string },
    unknown
  >
): UseMutationResult<
  AxiosResponse<T>,
  unknown,
  {
    [key: string]: string;
  },
  unknown
> => {
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const searchMutation = useMutation(
    (value: { [key: string]: string }) =>
      axios.get<T>(route, { params: { value } }),
    { onError, onSuccess: options?.onSuccess }
  );
  return searchMutation;
};
