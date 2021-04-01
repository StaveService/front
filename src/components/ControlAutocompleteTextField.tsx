import React, { useEffect, useState } from "react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import ControlTextField, { IControlTextFieldProps } from "./ControlTextField";
import { IArtist, IBand } from "../interfaces";

type IControlAutocompleteTextFieldProps = IControlTextFieldProps & {
  route: string;
};
const ControlAutocompleteTextField: React.FC<IControlAutocompleteTextFieldProps> = ({
  route,
  ...props
}: IControlAutocompleteTextFieldProps) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IArtist[] | IBand[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(route)
      .then((res) => setOptions(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);
  return (
    <Autocomplete
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
          {...props}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          InputProps={{
            ...params.InputProps,
            ...props.InputProps,
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

export default ControlAutocompleteTextField;
