import React, { ChangeEvent, useEffect, useState } from "react";
import Autocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import useOpen from "../hooks/useOpen";

type ControlAutocompleteTextFieldProps<T> = {
  maxLength?: number;
  onSelectOption?: (selectOption: T, options: T[]) => void;
  onRemoveOption?: (removeOption: T, options: T[]) => void;
  // material-ui
  textFieldProps: TextFieldProps;
  autocompleteProps: Omit<
    AutocompleteProps<T, true, false, false>,
    "renderInput"
  >;
};

function ControlAutocompleteTextField<T>({
  maxLength,
  onSelectOption,
  onRemoveOption,
  textFieldProps,
  autocompleteProps,
}: ControlAutocompleteTextFieldProps<T>): JSX.Element {
  const [disabled, setDisabled] = useState(false);
  const [tags, setTags] = useState<T[]>([]);
  const [open, onOpen, onClose] = useOpen();
  // handlers
  const handleChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: T | T[] | null,
    reason: string
  ) => {
    if (!value || !Array.isArray(value)) return;
    setDisabled(true);
    switch (reason) {
      case "select-option":
        if (onSelectOption) onSelectOption(value[value.length - 1], value);
        break;
      case "remove-option": {
        const removeTag = tags.filter((tag) => !value.includes(tag))[0];
        if (onRemoveOption) onRemoveOption(removeTag, value);
        break;
      }
      default:
        break;
    }
    setDisabled(false);
    setTags(value);
  };
  useEffect(() => {
    setTags(autocompleteProps?.value || []);
  }, [autocompleteProps.inputValue, autocompleteProps?.value]);
  return (
    <Autocomplete
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...autocompleteProps}
      open={open}
      disabled={disabled}
      getOptionDisabled={() => (maxLength ? tags.length >= maxLength : false)}
      noOptionsText="No Results"
      onChange={handleChange}
      onOpen={onOpen}
      onClose={onClose}
      renderInput={(params) => {
        return (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...textFieldProps}
            InputProps={{
              ...textFieldProps.InputProps,
              ...params.InputProps,
              endAdornment: (
                <>
                  {autocompleteProps.loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
    />
  );
}

ControlAutocompleteTextField.defaultProps = {
  onSelectOption: undefined,
  onRemoveOption: undefined,
  maxLength: undefined,
};

export default ControlAutocompleteTextField;
