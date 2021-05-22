import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import AutocompleteTextField from "../../../../../../../../components/AutocompleteTextField";
import { IBand, IBandsType, IMusic } from "../../../../../../../../interfaces";
import routes from "../../../../../../../../router/routes.json";
import queryKey from "../../../../../../../../gql/queryKey.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../../../slices/currentUser";
import { useQuerySnackbar } from "../../../../../../../../common/useQuerySnackbar";
import { graphQLClient } from "../../../../../../../../gql/client";
import { bandsQuery } from "../../../../../../../../gql/query/bands";

interface MutateVariables {
  option: IBand;
  options: IBand[];
}
const Band: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { onError } = useQuerySnackbar();
  // react-redux
  const headers = useSelector(selectHeaders);
  const dispatch = useDispatch();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  // react-query
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>([queryKey.MUSIC, id]);
  const handleCreateSuccess = (
    res: AxiosResponse<IBand>,
    { option }: MutateVariables
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.MUSIC, id],
      (prev) =>
        prev && {
          ...prev,
          band: option,
        }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse<IBand>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) => prev && { ...prev, band: undefined }
    );
  };
  const createMutation = useMutation(
    ({ option }: MutateVariables) =>
      axios.post<IBand>(match.url + routes.BANDS, option, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const handleSelectOption = (option: IBand, options: IBand[]) =>
    createMutation.mutate({ option, options });
  const destroyMutation = useMutation(
    ({ option }: MutateVariables) =>
      axios.delete<IBand>(`${match.url + routes.BANDS}/${option.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  const handleRemoveOption = (option: IBand, options: IBand[]) =>
    destroyMutation.mutate({ option, options });
  const bands = useQuery<IBand[]>(
    [queryKey.BANDS, { query: inputValue }],
    () =>
      graphQLClient
        .request<IBandsType>(bandsQuery, { q: inputValue, page: 1 })
        .then((res) => res.bands?.data || []),
    { enabled: !!inputValue, onError }
  );
  // handlers
  const onInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string
  ) => {
    setInputValue(value);
  };
  const getOptionSelected = (option: IBand, value: IBand) =>
    option.name === value.name;
  const getOptionLabel = (option: IBand) => option.name;
  return (
    <AutocompleteTextField<IBand>
      defaultValue={music?.band ? [music.band] : []}
      maxLength={1}
      onSelectOption={handleSelectOption}
      onRemoveOption={handleRemoveOption}
      textFieldProps={{
        label: "Band",
        variant: "outlined",
        margin: "normal",
      }}
      autocompleteProps={{
        multiple: true,
        options: bands.data || [],
        getOptionSelected,
        getOptionLabel,
        onInputChange,
      }}
    />
  );
};
export default Band;
