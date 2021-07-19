import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import useDebounce from "use-debounce/lib/useDebounce";
import AutocompleteTextField from "../../../../../../../../components/TextField/AutocompleteTextField";
import { IBand, IMusic } from "../../../../../../../../interfaces";
import routes from "../../../../../../../../constants/routes.json";
import queryKey from "../../../../../../../../constants/queryKey.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../../../slices/currentUser/currentUser";
import useQuerySnackbar from "../../../../../../../../hooks/useQuerySnackbar";
import { getBands } from "../../../../../../../../gql";

interface MutateVariables {
  option: IBand;
  options: IBand[];
}
const Band: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { onError } = useQuerySnackbar();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
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
      (prev) => prev && { ...prev, band: null }
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
  const bands = useQuery(
    [queryKey.BANDS, { query: debouncedInputValue }],
    getBands(1, { name_cont: debouncedInputValue }),
    { enabled: !!debouncedInputValue, onError }
  );
  // handlers
  const onInputChange = (
    e: ChangeEvent<Record<string, unknown>>,
    value: string,
    reason: string
  ) => reason === "input" && setInputValue(value);
  const getOptionSelected = (option: IBand, value: IBand) =>
    option.name === value.name;
  const getOptionLabel = (option: IBand) => option.name;
  return (
    <AutocompleteTextField<IBand>
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
        options: bands.data?.data || [],
        value: music?.band ? [music.band] : [],
        inputValue,
        loading:
          createMutation.isLoading || destroyMutation.isLoading || isPending(),
        getOptionSelected,
        getOptionLabel,
        onInputChange,
      }}
    />
  );
};
export default Band;
