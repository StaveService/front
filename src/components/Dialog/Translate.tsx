import React from "react";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UnpackNestedValue, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import TranslateIcon from "@material-ui/icons/Translate";
import { IAlbumParams, IArtistParams, IMusicParams } from "../../axios/axios";
import ControlTextField from "../ControlTextField/ControlTextField";
import LoadingCircularProgress from "../Loading/LoadingCircularProgress";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import LoadingButton from "../../ui/LoadingButton";
import { IAlbum, IArtist, IMusic } from "../../interfaces";
import useOpen from "../../hooks/useOpen";
import { setHeaders } from "../../slices/currentUser/currentUser";
import { selectLocale } from "../../slices/language";

interface TranslateProps<IModel, IModelParams> {
  queryKey: string;
  name: string;
  label: string;
  patchFn: (id: number, params: IModelParams) => Promise<AxiosResponse<IModel>>;
}

function Translate<
  IModel extends IAlbum | IArtist | IMusic,
  IModelParams extends IAlbumParams | IArtistParams | IMusicParams
>({
  queryKey,
  name,
  label,
  patchFn,
}: TranslateProps<IModel, IModelParams>): JSX.Element {
  const [open, handleOpen, handleClose] = useOpen();
  const { onError } = useQuerySnackbar();
  // react-redux
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  // react-router-dom
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  // react-hook-form
  const { errors, control, handleSubmit } = useForm();
  // react-query
  const queryClient = useQueryClient();
  const onSuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IModel | undefined>(
      [queryKey, id, locale],
      (prev) => prev && { ...prev }
    );
  };
  const updateMutation = useMutation(
    (data: IModelParams) => patchFn(id, data),
    {
      onSuccess,
      onError,
    }
  );
  const onSubmit = (data: UnpackNestedValue<IModelParams>) =>
    updateMutation.mutate(data as IModelParams);
  return (
    <>
      <IconButton onClick={handleOpen}>
        <TranslateIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Translate</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <ControlTextField
              name={name}
              defaultValue=""
              label={label}
              variant="outlined"
              control={control}
              errors={errors}
              disabled={updateMutation.isLoading}
              fullWidth
              InputProps={{
                endAdornment: (
                  <LoadingCircularProgress
                    color="inherit"
                    size={20}
                    loading={updateMutation.isLoading}
                  />
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              color="primary"
              disabled={!name}
              loading={updateMutation.isLoading}
              fullWidth
            >
              Translate {label}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
export default Translate;
