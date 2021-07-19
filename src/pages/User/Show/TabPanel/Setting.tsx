import React from "react";
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { AxiosResponse } from "axios";
import { userSchema } from "../../../../schema";
import ControlTextField from "../../../../components/ControlTextField/ControlTextField";
import { patchUser } from "../../../../axios/axios";
import {
  selectCurrentUser,
  selectHeaders,
  setCurrentUser,
  setHeaders,
} from "../../../../slices/currentUser/currentUser";
import { IUser } from "../../../../interfaces";
import LoadingButton from "../../../../ui/LoadingButton";
import useQuerySnackbar from "../../../../hooks/useQuerySnackbar";

const Setting: React.FC = () => {
  const { onError } = useQuerySnackbar();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(userSchema),
  });
  const handleSuccess = (res: AxiosResponse<IUser>) => {
    dispatch(setCurrentUser(res.data));
    dispatch(setHeaders(res.headers));
  };
  const { isLoading, mutate } = useMutation(
    (user: IUser) => patchUser(currentUser?.id, user, headers),
    { onSuccess: handleSuccess, onError }
  );
  const onSubmit = (user: IUser) => mutate(user);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" color="initial">
        Setting
      </Typography>
      <ControlTextField
        name="email"
        defaultValue={currentUser?.email}
        label="Email"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        fullWidth
      />
      <ControlTextField
        name="nickname"
        defaultValue={currentUser?.nickname}
        label="NickName"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        fullWidth
      />
      <ControlTextField
        name="familyname"
        defaultValue={currentUser?.familyname}
        label="FamilyName"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        fullWidth
      />
      <ControlTextField
        name="givenname"
        defaultValue={currentUser?.givenname}
        label="GivenName"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        fullWidth
      />
      <ControlTextField
        name="introduction"
        defaultValue={currentUser?.introduction}
        label="Introduction"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        rows={10}
        fullWidth
        multiline
      />
      <LoadingButton
        type="submit"
        loading={isLoading}
        color="primary"
        fullWidth
      >
        UPDATE
      </LoadingButton>
    </form>
  );
};
export default Setting;
