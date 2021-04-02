import React, { useEffect, useState } from "react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import ControlTextField, { IControlTextFieldProps } from "./ControlTextField";
import { IArtist, IBand } from "../interfaces";

type IControlAutocompleteTextFieldProps = {
  route: string;
  query: string;
  inputValue: string;
  controlTextFieldProps: IControlTextFieldProps;
  autocompleteProps?: {
    multiple?: boolean | undefined;
    disableClearable?: boolean | undefined;
    freeSolo?: boolean | undefined;
  };
};

const ControlAutocompleteTextField: React.FC<IControlAutocompleteTextFieldProps> = ({
  route,
  query,
  inputValue,
  controlTextFieldProps,
  autocompleteProps,
}: IControlAutocompleteTextFieldProps) => {
  const [options, setOptions] = useState<IArtist[] | IBand[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(route, { params: { q: { [query]: inputValue } } })
      .then((res) => setOptions(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [inputValue]);
  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  return (
    <Autocomplete
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...autocompleteProps}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <ControlTextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...controlTextFieldProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          InputProps={{
            ...params.InputProps,
            ...controlTextFieldProps.InputProps,
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
};
ControlAutocompleteTextField.defaultProps = {
  autocompleteProps: {
    multiple: undefined,
    disableClearable: undefined,
    freeSolo: undefined,
  },
};

export default ControlAutocompleteTextField;
