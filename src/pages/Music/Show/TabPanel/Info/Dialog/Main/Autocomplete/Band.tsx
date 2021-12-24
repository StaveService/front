import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useRouteMatch } from "react-router-dom";
import useDebounce from "use-debounce/lib/useDebounce";
import AutocompleteTextField from "../../../../../../../../components/TextField/AutocompleteTextField";
import { IBand, IMusic } from "../../../../../../../../interfaces";
import routes from "../../../../../../../../constants/routes.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../../../slices/currentUser/currentUser";
import useQuerySnackbar from "../../../../../../../../hooks/useQuerySnackbar";
import { selectLocale } from "../../../../../../../../slices/language";
import { useBandsQuery } from "../../../../../../../../reactQuery/query";
import { ShowProps } from "../../../../../interface";

interface MutateVariables {
  option: IBand;
  options: IBand[];
}
const Band: React.FC<ShowProps> = ({ queryKey }: ShowProps) => {
  const [inputValue, setInputValue] = useState("");
  const { onError } = useQuerySnackbar();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  const locale = useSelector(selectLocale);
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  // react-query
  const queryClient = useQueryClient();
  // react-intl
  const intl = useIntl();
  const music = queryClient.getQueryData<IMusic>(queryKey);
  const handleCreateSuccess = (
    res: AxiosResponse<IBand>,
    { option }: MutateVariables
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      queryKey,
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
      queryKey,
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
  const bands = useBandsQuery({
    page: 1,
    locale,
    q: { name_cont: debouncedInputValue },
    options: { enabled: !!debouncedInputValue },
  });
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
        label: intl.formatMessage({ id: "band" }),
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
