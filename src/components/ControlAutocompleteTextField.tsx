import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Control, DeepMap, FieldError } from "react-hook-form";
import axios from "axios";
import ControlTextField from "./ControlTextField";
import { IArtist, IBand } from "../interfaces";

interface IControlAutocompeteTextField {
  control: Control;
  errors: DeepMap<Record<string, any>, FieldError>;
  route: string;
  name: string;
  label: string;
}
const ControlAutocompleteTextField: React.FC<IControlAutocompeteTextField> = ({
  control,
  errors,
  route,
  name,
  label,
}: IControlAutocompeteTextField) => {
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
          {...params}
          control={control}
          errors={errors}
          name={name}
          label={label}
          InputProps={{
            ...params.InputProps,
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
