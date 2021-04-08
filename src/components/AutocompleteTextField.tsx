/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { search } from "../common/search";

type ControlAutocompleteTextFieldProps = {
  searchRoute: string;
  query: string;
  property: string;
  maxLength?: number;
  defaultValue?: any;
  onSelectOption?: (selectOption?: any, options?: any) => void;
  onRemoveOption?: (removeOption?: any, options?: any) => void;
  // material-ui
  textFieldProps: TextFieldProps;
  autocompleteProps?: {
    multiple?: boolean | undefined;
  };
};

const ControlAutocompleteTextField: FC<ControlAutocompleteTextFieldProps> = ({
  defaultValue,
  query,
  property,
  searchRoute,
  maxLength,
  onSelectOption,
  onRemoveOption,
  textFieldProps,
  autocompleteProps,
}: ControlAutocompleteTextFieldProps) => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: any,
    reason: string
  ) => {
    setLoading(true);
    switch (reason) {
      case "select-option":
        if (onSelectOption) onSelectOption(value[value.length - 1], value);
        break;
      case "remove-option":
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const removeTag = tags.filter((tag) => !value.includes(tag))[0];
        if (onRemoveOption) onRemoveOption(removeTag, value);
        break;
      default:
        break;
    }
    setLoading(false);
    setTags(value);
  };
  const handleInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string
  ) =>
    search<any>(
      searchRoute,
      { [`${property}_${query}`]: value },
      setOptions,
      setSearchLoading
    );
  useEffect(() => {
    setTags(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  return (
    <Autocomplete
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...autocompleteProps}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value={defaultValue}
      open={open}
      disabled={loading}
      getOptionSelected={(option, value) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        option[property] === value[property]
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      getOptionLabel={(option) => option[property]}
      getOptionDisabled={() => (maxLength ? tags.length >= maxLength : false)}
      options={options}
      loading={searchLoading}
      noOptionsText="No Results"
      onChange={handleChange}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={handleInputChange}
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
                {searchLoading ? (
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
};

ControlAutocompleteTextField.defaultProps = {
  onSelectOption: undefined,
  onRemoveOption: undefined,
  maxLength: undefined,
  defaultValue: undefined,
  autocompleteProps: {
    multiple: undefined,
  },
};

export default ControlAutocompleteTextField;
