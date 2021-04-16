import axios, { AxiosResponse } from "axios";
import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";
import ControlTextField from "../../../../../components/ControlTextField";
import LoadingButton from "../../../../../components/Loading/LoadingButton";
import { issueSchema } from "../../../../../schema";
import { selectHeaders, setHeaders } from "../../../../../slices/currentUser";
import { IIssue } from "../../../../../interfaces";

const New: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(issueSchema),
  });
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const onSuccess = (res: AxiosResponse<IIssue>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const { isLoading, mutate } = useMutation(
    (newIssue: IIssue) => axios.post<IIssue>(route, newIssue, headers),
    { onSuccess, onError }
  );
  const onSubmit = (data: IIssue) => mutate(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlTextField
        name="title"
        defaultValue=""
        autoComplete="on"
        label="Title"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        fullWidth
      />
      <ControlTextField
        name="description"
        defaultValue=""
        autoComplete="on"
        label="Description"
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        fullWidth
        multiline
      />
      <LoadingButton loading={isLoading}>create issue</LoadingButton>
    </form>
  );
};
export default New;
