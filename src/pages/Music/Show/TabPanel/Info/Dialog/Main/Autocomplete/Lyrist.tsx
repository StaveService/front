import { AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import useDebounce from "use-debounce/lib/useDebounce";
import AutocompleteTextField from "../../../../../../../../components/TextField/AutocompleteTextField";
import { IArtist, IMusic } from "../../../../../../../../interfaces";
import { setHeaders } from "../../../../../../../../slices/currentUser/currentUser";
import useQuerySnackbar from "../../../../../../../../hooks/useQuerySnackbar";
import {
  deleteLyristMusic,
  postLyristMusic,
} from "../../../../../../../../axios/axios";
import { selectLocale } from "../../../../../../../../slices/language";
import { useArtistsQuery } from "../../../../../../../../reactQuery/query";
import { ShowProps } from "../../../../../interface";

interface MutateVariables {
  option: IArtist;
  options: IArtist[];
}
const Lyrist: React.FC<ShowProps> = ({ queryKey }: ShowProps) => {
  const [inputValue, setInputValue] = useState("");
  const { onError } = useQuerySnackbar();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  // react-redux
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  // react-router-dom
  const params = useParams<{ userId: string; id: string }>();
  const id = Number(params.id);
  const userId = Number(params.userId);
  // react-query
  const queryClient = useQueryClient();
  // react-intl
  const intl = useIntl();
  const music = queryClient.getQueryData<IMusic>(queryKey);
  const handleCreateSuccess = (
    res: AxiosResponse<IArtist>,
    { options }: MutateVariables
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(queryKey, (prev) => {
      return (
        prev && {
          ...prev,
          lyrists: options,
        }
      );
    });
  };
  const handleDestroySuccess = (
    res: AxiosResponse<IArtist>,
    { options }: MutateVariables
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      queryKey,
      (prev) => prev && { ...prev, lyrists: options }
    );
  };
  const createMutation = useMutation(
    ({ option }: MutateVariables) => postLyristMusic(userId, id, option),
    { onSuccess: handleCreateSuccess, onError }
  );
  const handleSelectOption = (option: IArtist, options: IArtist[]) =>
    createMutation.mutate({ option, options });
  const destroyMutation = useMutation(
    ({ option }: MutateVariables) => deleteLyristMusic(userId, id, option.id),
    { onSuccess: handleDestroySuccess, onError }
  );
  const handleRemoveOption = (option: IArtist, options: IArtist[]) =>
    destroyMutation.mutate({ option, options });
  const lyrists = useArtistsQuery({
    page: 1,
    locale,
    q: { name_cont: debouncedInputValue },
    options: { enabled: !!debouncedInputValue },
  });
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
        label: intl.formatMessage({ id: "lyrists" }),
        variant: "outlined",
        margin: "normal",
      }}
      autocompleteProps={{
        multiple: true,
        value: music?.lyrists || [],
        options: lyrists.data?.data || [],
        loading:
          createMutation.isLoading || destroyMutation.isLoading || isPending(),
        getOptionSelected,
        getOptionLabel,
        onInputChange,
      }}
    />
  );
};
export default Lyrist;
