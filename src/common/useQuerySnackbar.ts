import { SnackbarOrigin, useSnackbar } from "notistack";

export const useQuerySnackbar = (): {
  onSuccess: (str: string) => void;
  onError: (err: unknown) => void;
} => {
  const { enqueueSnackbar } = useSnackbar();
  const onSuccess = (str: string) => {
    enqueueSnackbar(str, {
      variant: "success",
    });
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };

  return { onSuccess, onError };
};

export default undefined;
