import { useQuery, UseQueryResult } from "react-query";
import { getWikipedia } from "../axios/wikipedia";
import useQuerySnackbar from "../hooks/useQuerySnackbar";
import { IWikipedia } from "../interfaces";

export const useWikipediaQuery = (
  id: number | null | undefined
): UseQueryResult<IWikipedia> => {
  const { onError } = useQuerySnackbar();
  return useQuery<IWikipedia>(["wikipedia", id], () => getWikipedia(id), {
    enabled: !!id,
    onError,
  });
};
export default null;
