import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { useMutation, useQueryClient } from "react-query";
import ControlTextField from "../../../../components/ControlTextField";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import { selectHeaders, setHeaders } from "../../../../slices/currentUser";
import routes from "../../../../router/routes.json";
import { IMusic } from "../../../../interfaces";

const Setting: React.FC = () => {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const headers = useSelector(selectHeaders);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["musics", match.params.id]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onSuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.removeQueries(["musics", match.params.id]);
    history.push(routes.ROOT);
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const destroyMusicMutation = useMutation(
    () => axios.delete(match.url.replace("/setting", ""), headers),
    { onSuccess, onError }
  );
  const onSubmit = () => destroyMusicMutation.mutate();
  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Box m={3}>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <Typography>
            Please type{" "}
            <Box display="inline" fontWeight="Bold">
              {music?.title}
            </Box>{" "}
            to confirm.
          </Typography>
          <ControlTextField
            name="title"
            defaultValue=""
            autoComplete="on"
            label="Title"
            variant="outlined"
            control={control}
            errors={errors}
            disabled={destroyMusicMutation.isLoading}
            fullWidth
            rules={{ validate: (value) => value === music?.title }}
          />
          <LoadingButton
            type="button"
            loading={destroyMusicMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Delete Music
          </LoadingButton>
        </Box>
      </Dialog>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Delete this music
      </Button>
    </>
  );
};
Setting.defaultProps = {
  music: undefined,
};

export default Setting;
