import { AxiosResponse } from "axios";
import React from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { FormattedMessage, useIntl } from "react-intl";
import ControlTextField from "../../../../../components/ControlTextField/ControlTextField";
import LoadingButton from "../../../../../ui/LoadingButton";
import { issueSchema } from "../../../../../schema";
import { setHeaders } from "../../../../../slices/currentUser/currentUser";
import { IIssue } from "../../../../../interfaces";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import { postIssue } from "../../../../../axios/axios";

const New: React.FC = () => {
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(issueSchema),
  });
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  const params = useParams<{ userId: string; id: string }>();
  const userId = Number(params.userId);
  const id = Number(params.id);
  const history = useHistory();
  const dispatch = useDispatch();
  const { onError } = useQuerySnackbar();
  const intl = useIntl();
  const onSuccess = (res: AxiosResponse<IIssue>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
  };
  const { isLoading, mutate } = useMutation(
    (newIssue: IIssue) => postIssue(userId, id, newIssue),
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
        label={intl.formatMessage({ id: "title" })}
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
        label={intl.formatMessage({ id: "description" })}
        variant="outlined"
        margin="normal"
        control={control}
        errors={errors}
        disabled={isLoading}
        rows={10}
        fullWidth
        multiline
      />
      <LoadingButton type="submit" loading={isLoading}>
        <FormattedMessage id="createIssue" />
      </LoadingButton>
    </form>
  );
};
export default New;
