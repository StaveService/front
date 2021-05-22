import React, { ChangeEvent, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { useOpen } from "../common/useOpen";

type ControlAutocompleteTextFieldProps<T> = {
  defaultValue: T[];
  maxLength?: number;
  onSelectOption?: (selectOption: T, options: T[]) => void;
  onRemoveOption?: (removeOption: T, options: T[]) => void;
  // material-ui
  textFieldProps: TextFieldProps;
  autocompleteProps: {
    options: T[];
    multiple?: boolean | undefined;
    getOptionSelected?: (option: T, value: T) => boolean;
    getOptionLabel?: (option: T) => string;
    onInputChange?: (
      _e: ChangeEvent<Record<string, unknown>>,
      value: string
    ) => void;
  };
};

function ControlAutocompleteTextField<T>({
  defaultValue,
  maxLength,
  onSelectOption,
  onRemoveOption,
  textFieldProps,
  autocompleteProps,
}: ControlAutocompleteTextFieldProps<T>): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<T[]>(defaultValue || []);
  // useOpen
  const { open, handleOpen, handleClose } = useOpen();
  // handlers
  const handleChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: T | T[] | null,
    reason: string
  ) => {
    if (!value || !Array.isArray(value)) return;
    setLoading(true);
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
    setLoading(false);
    setTags(value);
  };
  return (
    <Autocomplete
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...autocompleteProps}
      value={defaultValue}
      open={open}
      disabled={loading}
      getOptionDisabled={() => (maxLength ? tags.length >= maxLength : false)}
      loading={loading}
      noOptionsText="No Results"
      onChange={handleChange}
      onOpen={handleOpen}
      onClose={handleClose}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...textFieldProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          InputProps={{
            ...params.InputProps,
            ...textFieldProps.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

ControlAutocompleteTextField.defaultProps = {
  onSelectOption: undefined,
  onRemoveOption: undefined,
  maxLength: undefined,
};

export default ControlAutocompleteTextField;
