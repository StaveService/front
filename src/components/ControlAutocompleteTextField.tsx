/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import {
  Control,
  DeepMap,
  FieldError,
  RegisterOptions,
  useController,
} from "react-hook-form";
import { search } from "../common/search";
import { IArtist } from "../interfaces";

type ControlAutocompleteTextFieldProps = {
  route: string;
  query: string;
  property: string;

  // react-hook-form
  name: string;
  defaultValue: string;
  control: Control;
  errors: DeepMap<Record<string, any>, FieldError>;
  rules?: RegisterOptions;

  // material-ui
  textFieldProps: TextFieldProps;
  autocompleteProps?: {
    multiple?: boolean | undefined;
    disableClearable?: boolean | undefined;
    freeSolo?: boolean | undefined;
  };
};

const ControlAutocompleteTextField: FC<ControlAutocompleteTextFieldProps> = ({
  name,
  defaultValue,
  control,
  rules,
  route,
  query,
  property,
  textFieldProps,
  autocompleteProps,
}: ControlAutocompleteTextFieldProps) => {
  const [options, setOptions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref, value, onChange },
    meta: { invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    autoCompleteValue: any
  ) => onChange(autoCompleteValue);
  const handleInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    inputValue: string
  ) =>
    search<any>(
      route,
      { [`${property}_${query}`]: inputValue },
      setOptions,
      setLoading
    );

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  return (
    <Autocomplete
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...autocompleteProps}
      open={open}
      getOptionSelected={(option, selectedValue) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        option[property] === selectedValue[property]
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      getOptionLabel={(option) => option[property]}
      options={options}
      loading={loading}
      noOptionsText="No Results"
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...textFieldProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          inputRef={ref}
          error={invalid}
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
      onChange={handleChange}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={handleInputChange}
    />
  );
};

ControlAutocompleteTextField.defaultProps = {
  autocompleteProps: {
    multiple: undefined,
    disableClearable: undefined,
    freeSolo: undefined,
  },
  rules: {},
};

export default ControlAutocompleteTextField;
