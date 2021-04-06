import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import ControlTextField from "../../../../components/ControlTextField";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../../../slices/currentUser";
import routes from "../../../../router/routes.json";
import MusicContext from "../context";

const Setting: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { music } = useContext(MusicContext);
  const history = useHistory();
  const params = useParams<{ id: string; userId: string }>();
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  const currentUser = useSelector(selectCurrentUser);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onSubmit = () => {
    if (!headers) return;
    setLoading(true);
    axios
      .delete(
        `${routes.USERS}/${currentUser?.id || "undefiend"}${routes.MUSICS}/${
          params.id
        }`,
        headers
      )
      .then((res) => {
        dispatch(setHeaders(res.headers));
        history.push(routes.ROOT);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
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
            disabled={loading}
            fullWidth
            rules={{ validate: (value) => value === music?.title }}
          />
          <LoadingButton
            type="button"
            loading={loading}
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
