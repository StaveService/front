import { AxiosResponse } from "axios";
import React from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import ControlTextField from "../../../../../components/ControlTextField";
import LoadingButton from "../../../../../components/Loading/LoadingButton";
import { issueSchema } from "../../../../../schema";
import { selectHeaders, setHeaders } from "../../../../../slices/currentUser";
import { IIssue } from "../../../../../interfaces";
import { useQuerySnackbar } from "../../../../../hooks/useQuerySnackbar";
import { postIssue } from "../../../../../axios/axios";

const New: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(issueSchema),
  });
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  const params = useParams<{ userId: string; musicId: string }>();
  const userId = Number(params.userId);
  const musicId = Number(params.musicId);
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const dispatch = useDispatch();
  const { onError } = useQuerySnackbar();
  const onSuccess = (res: AxiosResponse<IIssue>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
  };
  const { isLoading, mutate } = useMutation(
    (newIssue: IIssue) => postIssue(userId, musicId, newIssue, headers),
    {
      onSuccess,
      onError,
    }
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
      <LoadingButton type="submit" loading={isLoading}>
        create issue
      </LoadingButton>
    </form>
  );
};
export default New;
