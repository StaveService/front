import { useSnackbar } from "notistack";

export const useQuerySnackbar = (): {
  onError: (err: unknown) => void;
} => {
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  return { onError };
};
export default undefined;
