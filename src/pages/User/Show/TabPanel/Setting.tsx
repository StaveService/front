import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import Typography from "@material-ui/core/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { userSchema } from "../../../../schema";
import ControlTextField from "../../../../components/ControlTextField/ControlTextField";
import { patchUser } from "../../../../axios/axios";
import {
  selectCurrentUser,
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
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(userSchema),
  });
  const intl = useIntl();
  const handleSuccess = (res: AxiosResponse<IUser>) => {
    dispatch(setCurrentUser(res.data));
    dispatch(setHeaders(res.headers));
  };
  const { isLoading, mutate } = useMutation(
    (user: IUser) => patchUser(currentUser?.id, user),
    { onSuccess: handleSuccess, onError }
  );
  const onSubmit = (user: IUser) => mutate(user);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" color="initial">
        <FormattedMessage id="setting" />
      </Typography>
      <ControlTextField
        name="email"
        defaultValue={currentUser?.email}
        label={intl.formatMessage({ id: "email" })}
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
        label={intl.formatMessage({ id: "nickname" })}
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
        label={intl.formatMessage({ id: "familyname" })}
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
        label={intl.formatMessage({ id: "givenname" })}
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
        label={intl.formatMessage({ id: "introduction" })}
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
