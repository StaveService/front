import axios from "axios";
import React from "react";
import { useToggle } from "react-use";
import { useHistory, useRouteMatch } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ControlTextField from "../../../../../components/ControlTextField";
import LoadingButton from "../../../../../components/Loading/LoadingButton";
import { issueSchema } from "../../../../../schema";
import { selectHeaders, setHeaders } from "../../../../../slices/currentUser";
import { IIssue } from "../../../../../interfaces";

interface IIssueFormValues {
  title: string;
  description: string;
}
const New: React.FC = () => {
  const [loading, toggleLoadiing] = useToggle(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(issueSchema),
  });
  const match = useRouteMatch();
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = (data: SubmitHandler<IIssueFormValues>) => {
    if (!headers) return;
    toggleLoadiing();
    axios
      .post<IIssue>(match.url.replace("/new", ""), data, headers)
      .then((res) => {
        setHeaders(res.headers);
        history.push(`${match.url.replace("new", "")}${res.data.id}`);
      })
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoadiing);
  };
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
        disabled={loading}
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
        disabled={loading}
        fullWidth
        multiline
      />
      <LoadingButton loading={loading}>create issue</LoadingButton>
    </form>
  );
};
export default New;
