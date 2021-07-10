import { AxiosResponse } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { useMutation, useQueryClient } from "react-query";
import ControlTextField from "../../../../components/TextField/ControlTextField";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import { selectHeaders, setHeaders } from "../../../../slices/currentUser";
import routes from "../../../../constants/routes.json";
import { IMusic } from "../../../../interfaces";
import useOpen from "../../../../hooks/useOpen";
import useQuerySnackbar from "../../../../hooks/useQuerySnackbar";
import queryKey from "../../../../constants/queryKey.json";
import { deleteMusic } from "../../../../axios/axios";

const Setting: React.FC = () => {
  const [open, handleOpen, handleClose] = useOpen();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm();
  const history = useHistory();
  const match = useRouteMatch<{ userId: string; id: string }>();
  const id = Number(match.params.id);
  const userId = Number(match.params.userId);
  const headers = useSelector(selectHeaders);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>([queryKey.MUSIC, id]);
  const { onError } = useQuerySnackbar();
  const dispatch = useDispatch();
  const onSuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.removeQueries([queryKey.MUSIC, id]);
    history.push(routes.ROOT);
  };
  const destroyMusicMutation = useMutation(
    () => deleteMusic(userId, id, headers),
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
            color="secondary"
            loading={destroyMusicMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Delete Music
          </LoadingButton>
        </Box>
      </Dialog>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Delete this music
      </Button>
    </>
  );
};
Setting.defaultProps = {
  music: undefined,
};

export default Setting;
