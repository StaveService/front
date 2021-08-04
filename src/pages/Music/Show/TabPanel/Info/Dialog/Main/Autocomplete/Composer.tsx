import { AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import useDebounce from "use-debounce/lib/useDebounce";
import AutocompleteTextField from "../../../../../../../../components/TextField/AutocompleteTextField";
import { IArtist, IMusic } from "../../../../../../../../interfaces";
import queryKey from "../../../../../../../../constants/queryKey.json";
import { setHeaders } from "../../../../../../../../slices/currentUser/currentUser";
import useQuerySnackbar from "../../../../../../../../hooks/useQuerySnackbar";
import {
  deleteComposerMusic,
  postComposerMusic,
} from "../../../../../../../../axios/axios";
import { getArtists } from "../../../../../../../../gql";

interface MutateVariables {
  option: IArtist;
  options: IArtist[];
}
const Composer: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { onError } = useQuerySnackbar();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  // react-redux
  const dispatch = useDispatch();
  // react-router-dom
  const params = useParams<{ userId: string; id: string }>();
  const id = Number(params.id);
  const userId = Number(params.userId);
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
    ({ option }: MutateVariables) => postComposerMusic(userId, id, option),
    { onSuccess: handleCreateSuccess, onError }
  );
  const handleSelectOption = (option: IArtist, options: IArtist[]) =>
    createMutation.mutate({ option, options });
  const destroyMutation = useMutation(
    ({ option }: MutateVariables) => deleteComposerMusic(userId, id, option.id),
    { onSuccess: handleDestroySuccess, onError }
  );
  const handleRemoveOption = (option: IArtist, options: IArtist[]) =>
    destroyMutation.mutate({ option, options });
  const composers = useQuery(
    [queryKey.ARTISTS, { query: debouncedInputValue }],
    getArtists(1, { name_eq: debouncedInputValue }),
    { enabled: !!debouncedInputValue, onError }
  );
  // handlers
  const onInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string
  ) => setInputValue(value);
  const getOptionSelected = (option: IArtist, value: IArtist) =>
    option.name === value.name;
  const getOptionLabel = (option: IArtist) => option.name;
  return (
    <AutocompleteTextField<IArtist>
      onSelectOption={handleSelectOption}
      onRemoveOption={handleRemoveOption}
      textFieldProps={{
        label: "Composers",
        variant: "outlined",
        margin: "normal",
      }}
      autocompleteProps={{
        multiple: true,
        value: music?.composers || [],
        options: composers.data?.data || [],
        loading:
          createMutation.isLoading || destroyMutation.isLoading || isPending(),
        getOptionSelected,
        getOptionLabel,
        onInputChange,
      }}
    />
  );
};
export default Composer;
