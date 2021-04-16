import { useSnackbar } from "notistack";
import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "react-query";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useSnackbarMutation = (
  mutationFn: any,
  options?: UseMutationOptions<any>
) => {
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  return useMutation(mutationFn, { onError, onSuccess: options?.onSuccess });
};

export default useSnackbarMutation;
