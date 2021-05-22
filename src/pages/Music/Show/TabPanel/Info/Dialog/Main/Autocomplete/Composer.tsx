import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import AutocompleteTextField from "../../../../../../../../components/AutocompleteTextField";
import {
  IArtist,
  IArtistsType,
  IMusic,
} from "../../../../../../../../interfaces";
import routes from "../../../../../../../../router/routes.json";
import queryKey from "../../../../../../../../gql/queryKey.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../../../slices/currentUser";
import { useQuerySnackbar } from "../../../../../../../../common/useQuerySnackbar";
import { graphQLClient } from "../../../../../../../../gql/client";
import { artistsQuery } from "../../../../../../../../gql/query/artists";

interface MutateVariables {
  option: IArtist;
  options: IArtist[];
}
const Composer: React.FC = () => {
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
    res: AxiosResponse<IArtist>,
    { options }: MutateVariables
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) =>
        prev && {
          ...prev,
          composers: options,
        }
    );
  };
  const handleDestroySuccess = (
    res: AxiosResponse<IArtist>,
    { options }: MutateVariables
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) => prev && { ...prev, composers: options }
    );
  };
  const createMutation = useMutation(
    ({ option }: MutateVariables) =>
      axios.post<IArtist>(match.url + routes.COMPOSERS, option, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const handleSelectOption = (option: IArtist, options: IArtist[]) =>
    createMutation.mutate({ option, options });
  const destroyMutation = useMutation(
    ({ option }: MutateVariables) =>
      axios.delete<IArtist>(
        `${match.url + routes.COMPOSERS}/${option.id}`,
        headers
      ),
    { onSuccess: handleDestroySuccess, onError }
  );
  const handleRemoveOption = (option: IArtist, options: IArtist[]) =>
    destroyMutation.mutate({ option, options });
  const composers = useQuery<IArtist[]>(
    [queryKey.ARTISTS, { query: inputValue }],
    () =>
      graphQLClient
        .request<IArtistsType>(artistsQuery, { q: inputValue, page: 1 })
        .then((res) => res.artists?.data || []),
    { enabled: !!inputValue, onError }
  );

  // handlers
  const handleInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string
  ) => setInputValue(value);
  const getOptionSelected = (option: IArtist, value: IArtist) =>
    option.name === value.name;
  const getOptionLabel = (option: IArtist) => option.name;
  return (
    <AutocompleteTextField<IArtist>
      defaultValue={music?.composers || []}
      onSelectOption={handleSelectOption}
      onRemoveOption={handleRemoveOption}
      textFieldProps={{
        label: "Composers",
        variant: "outlined",
        margin: "normal",
      }}
      autocompleteProps={{
        multiple: true,
        options: composers.data || [],
        getOptionSelected,
        getOptionLabel,
        onInputChange: handleInputChange,
      }}
    />
  );
};
export default Composer;
