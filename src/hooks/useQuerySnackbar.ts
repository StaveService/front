/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { open } from "../ui/Dialog/authModal";
import { remove } from "../slices/currentUser/currentUser";

const useQuerySnackbar = (): {
  onError: (err: unknown) => void;
} => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (err.response?.status === 401) {
      dispatch(remove());
      dispatch(open());
    }
    enqueueSnackbar(String(err), { variant: "error" });
  };
  return { onError };
};
export default useQuerySnackbar;
